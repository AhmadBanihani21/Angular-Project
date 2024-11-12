import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../Services/account.service';
import { WarehouseService } from '../Services/warehouse.service';
import { Role } from 'src/DTOs/Role';
import { Warehouse } from 'src/DTOs/Warehouse';
import Swal from 'sweetalert2';
import { Signup } from 'src/DTOs/Signup';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  editMode: boolean = false;
  form1!: FormGroup;
  roles: Role[] = [];
  warehouses: Warehouse[] = [];
  userId!: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private warehouseService: WarehouseService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getAllRoles();
    this.getAllWarehouses();
    this.form1 = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]],
      name: ['', Validators.required],

      roleName: ['', Validators.required],
      warehouseId: ['', Validators.required],
    });
    if (this.activatedRoute.snapshot.queryParams['userId'] != undefined) {
      this.userId = this.activatedRoute.snapshot.queryParams['userId'];

      this.editUser();
      this.editMode = true;
      this.form1.controls['password'].reset();
      this.form1.controls['password'].clearValidators();
      this.form1.controls['password'].updateValueAndValidity();
    }
  }
  onRoleChange() {
    debugger;
    const role = this.form1.controls['roleName'].value;
    if (role === 'Employee') {
      this.form1.controls['warehouseId'].setValidators(Validators.required);
    }
    if (role !== 'Employee') {
      this.form1.controls['warehouseId'].reset();
      this.form1.controls['warehouseId'].clearValidators();
      this.form1.controls['warehouseId'].updateValueAndValidity();
    }
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
  getAllWarehouses() {
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
      },
    });
  }
  getAllRoles() {
    this.accountService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
    });
  }
  AddUser() {
    if (this.form1.valid) {
      var user = new Signup();
      user.userName = this.form1.value['username'];
      user.email = this.form1.value['email'];
      user.password = this.form1.value['password'];
      user.name = this.form1.value['name'];

      user.roleName = this.form1.value['roleName'];
      if (this.form1.value['roleName'] == 'Employee')
        user.warehouseId = this.form1.value['warehouseId'];

      this.accountService.Signup(user).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'user Created',
            text: 'user added successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/userList']);
          });
        },
      });
    }
  }
  editUser() {
    debugger;

    this.accountService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.form1.controls['username'].setValue(data.userName);
        this.form1.controls['email'].setValue(data.email);
        this.form1.controls['name'].setValue(data.name);

        this.accountService.getUserRoles(data.userName).subscribe({
          next: (roleData) => {
            const roleName = roleData[0];
            this.form1.controls['roleName'].setValue(roleName);

            if (roleName === 'Employee') {
              this.form1.controls['warehouseId'].setValue(data.warehouseId);
            } else {
              this.form1.controls['warehouseId'].reset();
              this.form1.controls['warehouseId'].clearValidators();
              this.form1.controls['warehouseId'].updateValueAndValidity();
            }
          },
        });
      },
    });
  }
  onUpdate() {
    if (this.form1.valid) {
      const updatedUser = new Signup();
      updatedUser.userId = this.userId;
      updatedUser.userName = this.form1.value['username'];
      updatedUser.email = this.form1.value['email'];
      updatedUser.name = this.form1.value['name'];

      updatedUser.roles = [this.form1.value['roleName']];

      if (this.form1.value['roleName'] === 'Employee') {
        updatedUser.warehouseId = this.form1.value['warehouseId'];
      }

      this.accountService.updateUser(updatedUser).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'User Updated',
            text: 'User details updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/userList']);
          });
        },
      });
    }
  }
}
