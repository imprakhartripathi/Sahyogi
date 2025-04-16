import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service/authenticator.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;
  userData: any;
  issuedate: string | null = null;
  isEditing = false;
  profileForm: FormGroup;

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private authservice: AuthenticatorService,
    public dialog: MatDialog,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      contactNumber: [''],
      sex: [''],
      bio: [''],
      orgName: [''],
      orgRole: [''],
      imageURL: [''], // Make sure this is initialized with empty string
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getCurrentUser.getCurrentUser().subscribe(
      (data) => {
        this.user = data;
        this.fetchUser(this.user.email);

        if (this.user.iat) {
          this.issuedate = this.formatDate(this.user.iat);
        }
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  fetchUser(email: string) {
    this.userService.getUserByEmail(email).subscribe(
      (data) => {
        this.userData = data;
        this.profileForm.patchValue({
          fullName: this.userData.fullName,
          email: this.userData.email,
          contactNumber: this.userData.contactNumber,
          sex: this.userData.sex,
          bio: this.userData.bio,
          orgName: this.userData.orgName,
          orgRole: this.userData.orgRole,
          imageURL: this.userData.imageURL,
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  formatDate(iat: number): string {
    const date = new Date(iat * 1000);
    return date.toLocaleString();
  }

  logout() {
    this.authservice.logout();
    this.dialog.closeAll();
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.patchValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        contactNumber: this.userData.contactNumber,
        sex: this.userData.sex,
        bio: this.userData.bio,
        orgName: this.userData.orgName,
        orgRole: this.userData.orgRole,
        imageURL: this.userData.imageURL,
      });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Get raw form values including disabled fields
    const formData = this.profileForm.getRawValue();

    // Prepare the request body
    const requestBody = {
      email: formData.email,
      updates: {
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        sex: formData.sex,
        bio: formData.bio,
        orgName: formData.orgName,
        orgRole: formData.orgRole,
        imageURL: formData.imageURL
      },
    };

    console.log('Sending to backend:', requestBody); // Debug log

    this.http
      .patch<any>(`${environment.backendUrl}/user/edit`, requestBody)
      .subscribe(
        (response) => {
          this.userData = response.user;
          this.isEditing = false;
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open(
            'Error updating profile. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      );
  }
}
