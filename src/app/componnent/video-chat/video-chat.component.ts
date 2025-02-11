import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
})
export class VideoChatComponent implements OnInit {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo!: ElementRef;

  localStream!: MediaStream;
  peerConnection!: RTCPeerConnection;
  roomId: string | null = null;
  remoteSocketId!: string;

  // Basic STUN server configuration
  configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  constructor(private socketService: SocketService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('callId');
    await this.setupLocalMedia();
    this.joinRoom();
    this.registerSocketListeners();
  }

  async setupLocalMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localVideo.nativeElement.srcObject = this.localStream;
      this.localVideo.nativeElement.play();
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  }

  joinRoom() {
    this.socketService.emit('room:join', { room: this.roomId });
  }

  registerSocketListeners() {
    // Confirmation of room join
    this.socketService.on('room:join').subscribe((data: any) => {
      console.log('Joined room:', data);
    });

    // When another user joins the room, initiate the call if you’re the first peer
    this.socketService.on('user:joined').subscribe(async (data: { id: string; }) => {
      console.log('User joined:', data);
      // data contains { id: socket.id } of the newly joined peer
      if (data.id !== this.socketService.getSocketId()) {
        this.remoteSocketId = data.id;
        await this.createPeerConnection();
        await this.initiateCall();
      }
    });

    // Handle incoming call (offer)
    this.socketService.on('incoming:call').subscribe(async (data: { from: string; offer: RTCSessionDescriptionInit; }) => {
      console.log('Incoming call:', data);
      // data contains { from, offer }
      this.remoteSocketId = data.from;
      await this.createPeerConnection();
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socketService.emit('call:accepted', { to: data.from, ans: answer });
    });

    // Handle answer from callee
    this.socketService.on('call:accepted').subscribe(async (data: { ans: RTCSessionDescriptionInit; }) => {
      console.log('Call accepted:', data);
      // data contains { from, ans }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.ans)
      );
    });

    // (Optional) Handle negotiation events if needed
    this.socketService.on('peer:nego:needed').subscribe(async (data) => {
      console.log('Negotiation needed:', data);
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socketService.emit('peer:nego:done', { to: data.from, ans: answer });
    });

    this.socketService.on('peer:nego:final').subscribe(async (data) => {
      console.log('Negotiation final:', data);
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.ans)
      );
    });
  }

  async createPeerConnection() {
    // Avoid creating multiple peer connections
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection(this.configuration);

    // Add local tracks to the connection
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    // When a remote track is received, display it in the remote video element
    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received', event.streams);
      if (this.remoteVideo.nativeElement.srcObject !== event.streams[0]) {
        this.remoteVideo.nativeElement.srcObject = event.streams[0];
        this.remoteVideo.nativeElement.play();
      }
    };

    // (Optional) Listen for ICE candidates and send them to the remote peer
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        // You could send the candidate via the signaling server here.
      }
    };
  }

  async initiateCall() {
    if (!this.peerConnection) return;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socketService.emit('user:call', {
      to: this.remoteSocketId,
      offer: offer,
    });
  }
}
