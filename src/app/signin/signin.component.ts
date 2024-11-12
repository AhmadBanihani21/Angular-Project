import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../Services/account.service';
import Swal from 'sweetalert2';
import { Signin } from 'src/DTOs/Signin';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  form1!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    debugger;
    this.form1 = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onSignin() {
    if (this.form1.valid) {
      const user = new Signin();
      user.username = this.form1.value['username'];
      user.password = this.form1.value['password'];

      this.accountService.Signin(user).subscribe({
        next: (response) => {
          debugger;
          localStorage.setItem('SecurityKey', response.tokenValue);
          this.accountService
            .getUserRoles(this.form1.value['username'])
            .subscribe({
              next: (data) => {
                localStorage.setItem('UserRoles', data[0]);
                this.accountService
                  .getUserInfo(this.form1.value['username'])
                  .subscribe({
                    next: (data2) => {
                      localStorage.setItem(
                        'WarehouseId',
                        JSON.parse(JSON.stringify(data2.warehouseId))
                      ),
                        localStorage.setItem('userData', JSON.stringify(data2));
                      this.router.navigate(['/Home']);
                    },
                  });
              },
            });
        },
      });
    }
  }
}
