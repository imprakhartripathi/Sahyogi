import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthenticatorService } from '../../services/authenticator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticator',
  standalone: false,
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticatorService, // Inject the service
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    }
  }

  onSignUp() {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.value;
      this.authService.signup(fullName, email, password).subscribe(
        (response: any) => {
          console.log('Signup successful:', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        (error) => {
          console.error('Signup failed:', error);
        }
      );
    }
  }

  private passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
