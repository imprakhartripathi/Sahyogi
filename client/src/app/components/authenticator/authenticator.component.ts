import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthenticatorService } from '../../services/authenticator.service/authenticator.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-authenticator',
  standalone: false,
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticatorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required]],
    });

    this.signupForm = this.fb.group(
      {
        fullName: ['', [Validators.required, this.nameValidator]],
        email: ['', [Validators.required, this.emailValidator]],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );

    // Trigger confirmPassword validation whenever password changes
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.isLoading = false;
          this.snackBar.open(
            `Welcome Back! Logged In Successfully, Session is Active for 30 Days`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.router.navigate(['/dashboard']);

          // ✅ Clear password field after login for security
          this.clearSensitiveFields();
        },
        () => {
          this.snackBar.open('Login failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
          this.isLoading = false;
        }
      );
    }
  }

  onSignUp() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { fullName, email, password } = this.signupForm.value;
      this.authService.signup(fullName, email, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.isLoading = false;
          this.snackBar.open(
            `Welcome to Sahyogi, ${fullName}! Signed Up Successfully, Session is Active for 30 Days`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.router.navigate(['/dashboard']);

          // ✅ Clear sensitive fields after signup
          this.clearSensitiveFields();
        },
        () => {
          this.snackBar.open('Signup failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
          this.isLoading = false;
        }
      );
    }
  }

  private clearSensitiveFields() {
    // ✅ Clear password fields
    this.loginForm.patchValue({ password: '' });
    this.signupForm.patchValue({ password: '', confirmPassword: '' });

    // ✅ Sanitize inputs to prevent autofill issues
    this.sanitizer.sanitize(1, this.loginForm.get('password')?.value || '');
    this.sanitizer.sanitize(1, this.signupForm.get('password')?.value || '');
    this.sanitizer.sanitize(
      1,
      this.signupForm.get('confirmPassword')?.value || ''
    );
  }

  private passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }

  private nameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(control.value) ? null : { invalidName: true };
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
}
