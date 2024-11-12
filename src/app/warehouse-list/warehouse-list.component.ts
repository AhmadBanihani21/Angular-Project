import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from '../Services/warehouse.service';
import { Warehouse } from 'src/DTOs/Warehouse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css'],
})
export class WarehouseListComponent implements OnInit {
  @ViewChild('location') locationInput!: ElementRef;
  warehouse: Warehouse[] = [];
  constructor(
    private warehouseService: WarehouseService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllWarehouses();
  }
  getAllWarehouses() {
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouse = data;
      },
    });
  }
  getAllWarehousesByLocation() {
    // debugger;
    const value = this.locationInput.nativeElement.value;
    if (value != '') {
      this.warehouseService.getWarehousesByLocation(value).subscribe({
        next: (data) => {
          this.warehouse = data;
        },
      });
    } else {
      this.getAllWarehouses();
    }
  }
  editWarehouse(id: number) {
    this.router.navigate(['/Home/addWarehouse'], {
      queryParams: { warehouseId: id },
    });
  }
  deleteWarehouse(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this warehouse? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.warehouseService.deleteWarehouse(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The warehouse has been deleted.', 'success');
            this.getAllWarehouses();
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'Failed to delete the warehouse: ' + err.message,
              'error'
            );
          },
        });
      } else {
        Swal.fire('Cancelled', 'The warehouse was not deleted.', 'info');
      }
    });
  }
}
