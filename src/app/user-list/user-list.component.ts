import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { User } from 'src/DTOs/User';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @ViewChild('userName') userNameInput!: ElementRef;
  users: User[] = [];
  selectedRole: string = '';
  pageNumber: number = 1;
  pageSize: number = 3;
  disablePagination: boolean = false;
  noNext!: boolean;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getUsersByRole() {
    if (this.selectedRole === '') {
      this.disablePagination = false;
      this.getAllUsers();
    } else {
      debugger;

      this.disablePagination = true;
      this.accountService.getUsersByRole(this.selectedRole).subscribe({
        next: (data) => {
          this.users = data;
          this.noNext = this.users.length < this.pageSize;
        },
      });
    }
  }

  getAllUsers() {
    this.accountService.getAllUsers(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.users = data;
        this.noNext = this.users.length < this.pageSize;
      },
    });
  }

  getUsersByName() {
    debugger;
    const value = this.userNameInput.nativeElement.value;
    if (value !== '') {
      this.accountService.getUserInfo(value).subscribe({
        next: (data) => {
          this.users = [];
          this.users = [data];
        },
      });
    } else {
      this.getAllUsers();
    }
  }

  nextPage() {
    if (!this.disablePagination) {
      this.pageNumber++;
      this.getAllUsers();
    }
  }

  prevPage() {
    if (!this.disablePagination && this.pageNumber > 1) {
      this.pageNumber--;
      this.getAllUsers();
    }
  }

  editUser(userId: string) {
    this.router.navigate(['/Home/addUser'], { queryParams: { userId } });
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Uncomment the following lines to enable user deletion:
        // this.accountService.deleteUser(userId).subscribe({
        //   next: () => {
        //     Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        //     this.getAllUsers();
        //   },
        //   error: (err) => {
        //     Swal.fire('Error!', 'Failed to delete the user: ' + err.message, 'error');
        //   },
        // });
      } else {
        Swal.fire('Cancelled', 'The user was not deleted.', 'info');
      }
    });
  }

  toggleLockStatus(userId: string, isLocked: boolean) {
    if (isLocked) {
      this.unlockUser(userId);
    } else {
      this.lockUser(userId);
    }
  }

  lockUser(userId: string) {
    debugger;
    this.accountService.lockUser(userId).subscribe({
      next: () => {
        Swal.fire('Success', 'User has been locked.', 'success');
        this.getAllUsers();
      },
      error: (err) => {
        Swal.fire('Error', `Failed to lock user: ${err.message}`, 'error');
      },
    });
  }

  unlockUser(userId: string) {
    this.accountService.unlockUser(userId).subscribe({
      next: () => {
        Swal.fire('Success', 'User has been unlocked.', 'success');
        this.getAllUsers();
      },
      error: (err) => {
        Swal.fire('Error', `Failed to unlock user: ${err.message}`, 'error');
      },
    });
  }
}
