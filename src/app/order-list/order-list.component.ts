import { Component, OnInit } from '@angular/core';
import { Order } from 'src/DTOs/Order';
import { OrderService } from '../Services/order.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  priceMin: number = 0;
  priceMax: number = 0;
  fromDate!: string;
  toDate!: string;
  warehouseId = parseInt(localStorage.getItem('WarehouseId') || '0');
  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.getAllOrders();
  }
  getAllOrders() {
    this.orderService.GetAllOrdersByWarehuseId(this.warehouseId).subscribe({
      next: (data) => {
        this.orders = data;
      },
    });
  }
  editOrder(id: number) {
    this.router.navigate(['/Home/addOrder'], {
      queryParams: { orderId: id },
    });
  }
  deleteOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this order? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The order has been deleted.', 'success');
            this.getAllOrders();
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'Failed to delete the order: ' + err.message,
              'error'
            );
          },
        });
      } else {
        Swal.fire('Cancelled', 'The order was not deleted.', 'info');
      }
    });
  }
  filterByTotalPrice(): void {
    debugger;
    if (
      this.priceMin == null ||
      this.priceMax == null ||
      this.priceMin > this.priceMax
    ) {
      this.getAllOrders();
    } else {
      this.orderService
        .filterByPrice(this.priceMin, this.priceMax, this.warehouseId)
        .subscribe({
          next: (data) => {
            this.orders = data;
          },
        });
    }
  }
  sortAsc() {
    this.orderService.SortProductAscending(this.warehouseId).subscribe({
      next: (data) => {
        this.orders = data;
      },
    });
  }
  sortDesc() {
    this.orderService.SortProductDescending(this.warehouseId).subscribe({
      next: (data) => {
        this.orders = data;
      },
    });
  }
  filterByDate() {
    if (
      this.fromDate == undefined ||
      this.toDate == undefined ||
      this.fromDate > this.toDate
    ) {
      this.getAllOrders();
    } else {
      this.orderService
        .filterByDate(this.fromDate, this.toDate, this.warehouseId)
        .subscribe({
          next: (data) => {
            this.orders = data;
          },
        });
    }
  }
}
