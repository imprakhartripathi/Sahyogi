import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private http: HttpClient, private fb: FormBuilder, public location: Location) {
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
}
