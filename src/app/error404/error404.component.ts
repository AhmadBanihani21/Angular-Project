import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
})
export class Error404Component implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    Swal.fire({
      icon: 'error',
      title: 'Not Found',
      text: 'The Page Not Found',
      timer: 5000,
      timerProgressBar: true,
      showCancelButton: false,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
        this.router.navigate(['/Home']);
      }
    });
  }
}
