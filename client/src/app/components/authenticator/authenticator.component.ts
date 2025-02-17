import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

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
    private http: HttpClient,
    private router: Router // Inject Router
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
      this.http
        .post('http://localhost:4200/login', this.loginForm.value)
        .subscribe(
          (response: any) => {
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/']); // Redirect to "/"
          },
          (error) => {
            console.error('Login failed:', error);
          }
        );
    }
  }

  onSignUp() {
    if (this.signupForm.valid) {
      this.http
        .post('http://localhost:4200/signup', this.signupForm.value)
        .subscribe(
          (response: any) => {
            console.log('Signup successful:', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/']); // Redirect to "/"
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
