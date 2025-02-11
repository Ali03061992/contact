import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private socketId : string = '';

  constructor() {
    // Connect to your NestJS backend (adjust the URL/port as necessary)
    this.socket = io('http://localhost:3000');
  }

  // Emit an event to the backend
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Subscribe to an event from the backend
  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }

  // Get the current socket id
  getSocketId(): string {
    return this.socketId;
  }

  setSocketId(socket: string) {
     this.socketId = socket;
  }
}
