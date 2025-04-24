import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-support',
  standalone: false,
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  supportForm: FormGroup;
  inProgress: boolean = false;

  focusState: { [key in 'name' | 'email' | 'phone' | 'message']: boolean } = {
    name: false,
    email: false,
    phone: false,
    message: false,
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public location: Location
  ) {
    this.supportForm = this.fb.group({
      name: ['', Validators.required, this.nameValidator],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Submit triggered'); // Debug check

    if (this.supportForm.valid) {
      this.inProgress = true;
      const { name, email, phone, message } = this.supportForm.value;

      const params = new HttpParams()
        .set('name', name)
        .set('email', email)
        .set('phone', phone)
        .set('message', message);

      this.http
        .get(`${environment.backendUrl}/mail/support`, { params })
        .subscribe({
          next: () => {
            alert('Support message sent!');
            this.supportForm.reset();
            this.focusState = {
              name: false,
              email: false,
              phone: false,
              message: false,
            };
            this.inProgress = false;
          },
          error: () => {
            alert('Failed to send support message.');
            this.inProgress = false;
          },
        });
    } else {
      alert('Please fill out all required fields correctly.');
      this.supportForm.markAllAsTouched(); // Show validation errors if form is invalid
    }
  }

  onFocus(field: keyof typeof this.focusState) {
    this.focusState[field] = true;
  }

  onBlur(field: keyof typeof this.focusState) {
    if (!this.supportForm.get(field)?.value) {
      this.focusState[field] = false;
    }
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
}
