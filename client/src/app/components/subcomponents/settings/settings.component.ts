import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../enviroments/enviroment';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../services/theme.service/theme.service';

export enum ColorTheme {
  System = 'system',
  Dark = 'dark',
  Light = 'light',
}

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  passwordForm: FormGroup;
  deleteForm: FormGroup;
  user: any;
  userData: any;
  private themeOrder = [ColorTheme.System, ColorTheme.Light, ColorTheme.Dark];
  private savingInProgress = false;
  isDeleting: boolean = false;
  pwChanging: boolean = false;

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private themeService: ThemeService
  ) {
    this.settingsForm = this.fb.group({
      notificationsOn: [true],
      emailNotificationsOn: [true],
      userSetTheme: [ColorTheme.System],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, this.passwordValidator]],
    });

    this.deleteForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const currentTheme = this.themeService.getTheme();
    this.settingsForm.get('userSetTheme')?.setValue(currentTheme);
    this.initialize();
  }

  initialize() {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchUser(data.email);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.showError('Failed to load user data');
      },
    });
  }

  fetchUser(email: string) {
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.userData = data;
        this.settingsForm.patchValue({
          notificationsOn: data.notificationsOn,
          emailNotificationsOn: data.emailNotificationsOn,
          userSetTheme: data.userSetTheme || ColorTheme.System,
        });

        // Set up value changes for auto-save
        this.setupAutoSave();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.showError('Failed to load user settings');
      },
    });
  }

  private setupAutoSave() {
    this.settingsForm.valueChanges.subscribe(() => {
      if (!this.savingInProgress && this.settingsForm.valid) {
        this.saveSettings();
      }
    });

    this.settingsForm
      .get('userSetTheme')
      ?.valueChanges.subscribe((theme: ColorTheme) => {
        this.onThemeChange(theme);
      });
  }

  private saveSettings() {
    this.savingInProgress = true;
    const updates = this.settingsForm.value;

    this.http
      .patch(`${environment.backendUrl}/user/edit`, {
        email: this.user.email,
        updates: updates,
      })
      .subscribe({
        next: () => {
          this.savingInProgress = false;
        },
        error: (err) => {
          console.error('Error saving settings:', err);
          this.showError('Failed to save settings');
          this.savingInProgress = false;
        },
      });
  }

  toggleSetting(settingName: string) {
    const currentValue = this.settingsForm.get(settingName)?.value;
    this.settingsForm.get(settingName)?.setValue(!currentValue);
  }

  onThemeChange(theme: ColorTheme): void {
    this.themeService.setTheme(theme);
  }

  cycleTheme() {
    const currentTheme = this.settingsForm.get('userSetTheme')?.value;
    const currentIndex = this.themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % this.themeOrder.length;
    this.settingsForm.get('userSetTheme')?.setValue(this.themeOrder[nextIndex]);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.pwChanging = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.http
      .post(`${environment.backendUrl}/user/pwchange`, {
        email: this.user.email,
        currentPassword,
        newPassword,
      })
      .subscribe({
        next: (res: any) => {
          this.pwChanging = false;
          this.showSuccess(res.message || 'Password changed successfully');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.pwChanging = false;
          this.showError(err.error?.message || 'Password change failed');
        },
      });
  }

  deleteAccount(): void {
    if (this.deleteForm.invalid) return;

    this.isDeleting = true;
    const { email, password } = this.deleteForm.value;

    if (email !== this.user.email) {
      this.showError('Email does not match your account');
      return;
    }

    this.http
      .delete(`${environment.backendUrl}/user/delete`, {
        body: { email, password },
      })
      .subscribe({
        next: () => {
          this.dialog.closeAll();
          this.isDeleting = false;
          this.showSuccess('Account deleted successfully');
          localStorage.clear();
          this.router.navigate(['/auth']);
        },
        error: (err) => {
          this.isDeleting = false;
          this.showError(err.error?.message || 'Failed to delete account');
        },
      });
  }

  private emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|ac|edu|org)$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[.,\/;'[\]\-=!@#$%^&*()_+{}|":<>?~\\])[A-Za-z\d.,\/;'[\]\-=!@#$%^&*()_+{}|":<>?~\\]{8,}$/;
    return passwordRegex.test(control.value) ? null : { weakPassword: true };
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
