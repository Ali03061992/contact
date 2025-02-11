import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ContactComponent } from "./componnent/contact/contact.component";
import { AuthGuard } from "./auth.guard";
import { VideoChatComponent } from "./componnent/video-chat/video-chat.component";

export const routes: Routes = [
    {
      path: '',
      component: AppComponent, 
      children: [
        { path: 'contact', component: ContactComponent, canActivate: [AuthGuard]  },
        { path: 'call/:callId', component: VideoChatComponent  },
      ],
    },
    { path: 'login', component: LoginComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule, HttpClientModule],
    providers:[HttpClient]
  })
  export class AppRoutingModule {}