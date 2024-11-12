import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccountService } from '../Services/account.service';
import { Signup } from 'src/DTOs/Signup';
import { User } from 'src/DTOs/User';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  form1!: FormGroup;
  user!: User;
  userId: string = '';
  editMode: boolean = false;
  warehouseId = parseInt(localStorage.getItem('WarehouseId') || '0');
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form1 = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
    });

    this.loadUserData();
  }

  loadUserData(): void {
    debugger;
    const loggedInUser = localStorage.getItem('userData');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      this.userId = userData.id;

      this.form1.controls['username'].setValue(userData.userName);
      this.form1.controls['email'].setValue(userData.email);
      this.form1.controls['name'].setValue(userData.name);
    } else {
      this.router.navigate(['/Home']);
    }
  }

  onUpdate(): void {
    if (this.form1.valid) {
      const updatedUser = new Signup();
      updatedUser.userId = this.userId;
      updatedUser.userName = this.form1.value['username'];
      updatedUser.email = this.form1.value['email'];
      updatedUser.name = this.form1.value['name'];
      updatedUser.warehouseId = this.warehouseId;

      this.accountService.updateUser(updatedUser).subscribe({
        next: () => {
          this.accountService
            .getUserInfo(this.form1.value['username'])
            .subscribe({
              next: (data2) => {
                localStorage.setItem('userData', JSON.stringify(data2));
              },
            });
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home']);
          });
        },
      });
    }
  }
}
