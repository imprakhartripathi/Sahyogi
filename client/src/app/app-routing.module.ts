import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

import { MainpageComponent } from './components/mainpage/mainpage.component';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SupportComponent } from './components/support/support.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { BacklogComponent } from './components/backlog/backlog.component';


const routes: Routes = [
  // Guarded Paths
  { path: '', component: DashboardComponent, data: { title: 'Sahyogi - Dashboard' }, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, data: { title: 'Sahyogi - Task Management' }, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, data: { title: 'Sahyogi - Project Management' }, canActivate: [AuthGuard] },
  { path: 'backlog', component: BacklogComponent, data: { title: 'Sahyogi - Backlog' }, canActivate: [AuthGuard] },

  // Un-Guarded Paths
  { path: 'mainpage', component: MainpageComponent, data: { title: 'Welcome to Sahyogi' } },
  { path: 'auth', component: AuthenticatorComponent, data: { title: 'Sahyogi - Authenticator' } },
  { path: 'support', component: SupportComponent, data: { title: 'Sahyogi - Support' } },
  
  // Redirecting Paths
  { path: 'dashboard', redirectTo: '' },
  { path: '**', redirectTo: 'auth' }, // Redirect unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
