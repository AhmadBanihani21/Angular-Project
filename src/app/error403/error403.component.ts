import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css'],
})
export class Error403Component implements OnInit {
  constructor(private router: Router, private location: Location) {}
  ngOnInit(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Permission Required',
      text: "You don't have permission",
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
