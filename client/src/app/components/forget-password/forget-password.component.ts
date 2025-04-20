import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

import { ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';




@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  // Add this inside your component class
  @ViewChild('stepper') stepper!: MatStepper;
  emailFormGroup: FormGroup;
  otpFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  isLoading = false;
  currentEmail = '';

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.emailFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
    });

    this.otpFormGroup = this._formBuilder.group({
      otp: ['', Validators.required],
    });

    this.passwordFormGroup = this._formBuilder.group(
      {
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLengthValid = value.length >= 8;

    const passwordValid =
      hasUpperCase && hasNumber && hasSpecialChar && isLengthValid;

    return !passwordValid ? { weakPassword: true } : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  initiatePasswordReset() {
    if (this.emailFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const email = this.emailFormGroup.value.email;
    this.currentEmail = email;

    this.http
      .post(`${environment.backendUrl}/user/initiate-reset`, { email })
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Failed to send OTP');
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('OTP sent to your email', 'Close', {
            duration: 5000,
          });
          this.stepper.next(); // Move to next step
        },
        error: () => (this.isLoading = false),
      });
  }

  validateOtp() {
    if (this.otpFormGroup.invalid || !this.currentEmail) {
      return;
    }

    this.isLoading = true;
    const otp = this.otpFormGroup.value.otp;

    this.http
      .post(`${environment.backendUrl}/user/validate-otp`, {
        email: this.currentEmail,
        otp,
      })
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Invalid OTP');
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('OTP verified successfully', 'Close', {
            duration: 3000,
          });
          this.stepper.next(); // Move to next step
        },
        error: () => (this.isLoading = false),
      });
  }

  resetPassword() {
    if (this.passwordFormGroup.invalid || !this.currentEmail) {
      return;
    }

    this.isLoading = true;
    const newPassword = this.passwordFormGroup.value.password;
    const otp = this.otpFormGroup.value.otp;

    this.http
      .post(`${environment.backendUrl}/user/reset-password`, {
        email: this.currentEmail,
        otp,
        newPassword,
      })
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Failed to reset password');
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Password reset successfully', 'Close', {
            duration: 5000,
          });
          this.stepper.next(); // Move to final step
        },
        error: () => (this.isLoading = false),
      });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|ac|edu|org)$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
}
