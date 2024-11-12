// change-password.component.ts
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../Services/account.service';
import Swal from 'sweetalert2';
import { ChangePassword } from 'src/DTOs/ChangePassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, this.passwordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordsMatchValidator(
          'newPassword',
          'confirmPassword'
        ),
      }
    );
  }

  passwordsMatchValidator(
    newPasswordKey: string,
    confirmPasswordKey: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const newPassword = formGroup.get(newPasswordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
      if (newPassword !== confirmPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';

      const hasRequiredLength = value.length >= 8;
      const hasDigit = /\d/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(value);

      const isValid =
        hasRequiredLength &&
        hasDigit &&
        hasLowercase &&
        hasUppercase &&
        hasNonAlphanumeric;

      return isValid ? null : { passwordStrength: true };
    };
  }

  onChangePassword() {
    debugger;
    if (this.changePasswordForm.valid) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      var changePasswordDto = new ChangePassword();
      changePasswordDto.username = userData.userName;
      changePasswordDto.oldPassword =
        this.changePasswordForm.value['oldPassword'];
      changePasswordDto.newPassword =
        this.changePasswordForm.value['newPassword'];

      if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'New password cannot be the same as the old password.',
        });
        return;
      }

      this.accountService.ChangeUserPassword(changePasswordDto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Password Changed',
            text: 'Your password has been updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home']);
          });
        },
        // error: (error) => {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Error',
        //     text: error.error || 'Failed to change password',
        //   });
        // },
      });
    }
  }
}
