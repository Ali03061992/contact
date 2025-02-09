import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent } from './contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';



@NgModule({
  imports: [CommonModule, FormsModule,HttpClientModule], 
    providers: [AuthService, HttpClient],
})
export class ComponnentModule { }
