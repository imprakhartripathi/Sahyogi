import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Material Animations
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core'; // Datepicker Adapter
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthenticatorComponent } from './components/authenticator/authenticator.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';
import { SettingsComponent } from './components/subcomponents/settings/settings.component';
import { ProfileComponent } from './components/subcomponents/profile/profile.component';
import { NotificationsComponent } from './components/subcomponents/notifications/notifications.component';
import { AiPrioritizationComponent } from './components/subcomponents/ai-prioritization/ai-prioritization.component';
import { SupportComponent } from './components/support/support.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { BacklogComponent } from './components/backlog/backlog.component';
import { BrokenRouteComponent } from './components/broken-route/broken-route.component';
import { TaskDetailsComponent } from './components/subcomponents/task-details/task-details.component';
import { CreatorButtonOverlayComponent } from './components/subcomponents/creator-button-overlay/creator-button-overlay.component';
import { TaskCreatorComponent } from './components/subcomponents/task-creator/task-creator.component';
import { ProjectCreatorComponent } from './components/subcomponents/project-creator/project-creator.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectTaskCreatorComponent } from './components/subcomponents/project-task-creator/project-task-creator.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ProjectTaskDetailsComponent } from './components/subcomponents/project-task-details/project-task-details.component';
import { ProjectEditorComponent } from './components/subcomponents/project-editor/project-editor.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticatorComponent,
    NavbarComponent,
    DashboardComponent,
    MainpageComponent,
    DateFormatterPipe,
    SettingsComponent,
    ProfileComponent,
    NotificationsComponent,
    AiPrioritizationComponent,
    SupportComponent,
    TasksComponent,
    ProjectsComponent,
    BacklogComponent,
    BrokenRouteComponent,
    TaskDetailsComponent,
    CreatorButtonOverlayComponent,
    TaskCreatorComponent,
    ProjectCreatorComponent,
    ProjectDetailsComponent,
    ProjectTaskCreatorComponent,
    TruncatePipe,
    ProjectTaskDetailsComponent,
    ProjectEditorComponent,
    ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatStepperModule,
    MatSliderModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatProgressSpinnerModule,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    MatProgressBarModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
