import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

import { MainpageComponent } from './components/mainpage/mainpage.component';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  { path: '', component: MainpageComponent, data: { title: 'Welcome to Sahyogi' } },
  { path: 'auth', component: AuthenticatorComponent, data: { title: 'Authenticator' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'auth' }, // Redirect unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
