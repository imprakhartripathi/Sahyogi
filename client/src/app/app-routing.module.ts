import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';
import { title } from 'process';

const routes: Routes = [
  { path: '', component: MainpageComponent, data: { title: 'Welcome to Sahyogi' } },
  { path: 'auth', component: AuthenticatorComponent, data: { title: 'Authenticator' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
