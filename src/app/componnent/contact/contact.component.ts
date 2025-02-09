import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
   imports: [FormsModule, CommonModule],
})
export class ContactComponent implements OnInit {
  countries: Country[] = [
    { code: 'TN', name: 'Tunisia', dialCode: '+216' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'US', name: 'USA', dialCode: '+1' }
  ];
  public selectedCountry: string= '';
  public phoneNumber: string = '';
  message: string = '';
  link: string = '';
  showMessage: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  sendSms() {
    if (/^[0-9]{8,15}$/.test(this.phoneNumber)) {
      const fullNumber = this.selectedCountry + this.phoneNumber;
      const headers = new HttpHeaders({
        'Accept': '*/*',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      });
      const body = {
        "from": "+19035231367",
        "to": fullNumber
      };

      this.http.post<any>('/api/sms/send', body, { headers }).subscribe(
        (response) => {
          this.message = "Un message a été envoyé avec succès.";
          this.link = response.link || '';
          this.showMessage = true;
          this.resetForm();
        },
        error => {
          alert("Le numéro entré n'est pas valide.");
          console.error('Erreur envoi SMS:', error);
        }
      );
    } else {
      alert("Le numéro entré n'est pas valide.");
    }
  }

  resetForm() {
    this.phoneNumber = '';
    this.selectedCountry = '';
  }

  copyLink() {
    navigator.clipboard.writeText(this.link).then(() => {
      alert("Lien copié !");
    }).catch(err => {
      console.error("Erreur copie lien:", err);
    });
  }
}
