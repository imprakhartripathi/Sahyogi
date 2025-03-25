import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: false,
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  supportForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.pattern(/^\d{10}$/)), // Optional validation
    message: new FormControl('', Validators.required),
  });

  // Object to track focus state for each input field
  focusState: { [key in 'name' | 'email' | 'phone' | 'message']: boolean } = {
    name: false,
    email: false,
    phone: false,
    message: false,
  };

  onSubmit() {
    if (this.supportForm.valid) {
      console.log('Form Submitted:', this.supportForm.value);
      alert('Form submitted successfully!');
      this.supportForm.reset();
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  // Fix: Explicitly type 'field' using keyof focusState
  onFocus(field: keyof typeof this.focusState) {
    this.focusState[field] = true;
  }

  onBlur(field: keyof typeof this.focusState) {
    if (!this.supportForm.get(field)?.value) {
      this.focusState[field] = false;
    }
  }
}
