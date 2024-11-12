import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/DTOs/Product';
import { ProductService } from '../Services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  @ViewChild('name') nameInput!: ElementRef;
  product: Product[] = [];
  priceMin: number = 0;
  priceMax: number = 0;
  warehouseId = parseInt(localStorage.getItem('WarehouseId') || '0');
  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    this.productService.GetAllProductsByWarehuseId(this.warehouseId).subscribe({
      next: (data) => {
        this.product = data;
      },
    });
  }
  editProduct(id: number) {
    this.router.navigate(['/Home/addProduct'], {
      queryParams: { productId: id },
    });
  }
  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this product? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
            this.getAllProducts();
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'Failed to delete the product: ' + err.message,
              'error'
            );
          },
        });
      } else {
        Swal.fire('Cancelled', 'The product was not deleted.', 'info');
      }
    });
  }
  getAllProductsByName() {
    const value = this.nameInput.nativeElement.value;
    if (value != '') {
      this.productService.getProductsByName(value, this.warehouseId).subscribe({
        next: (data) => {
          this.product = data;
        },
      });
    } else {
      this.getAllProducts();
    }
  }
  filterByPrice(): void {
    debugger;
    if (
      this.priceMin == null ||
      this.priceMax == null ||
      this.priceMin > this.priceMax
    ) {
      this.getAllProducts();
    } else {
      this.productService
        .filterByPrice(this.priceMin, this.priceMax, this.warehouseId)
        .subscribe({
          next: (data) => {
            this.product = data;
          },
        });
    }
  }
  sortAsc() {
    this.productService.SortProductAscending(this.warehouseId).subscribe({
      next: (data) => {
        this.product = data;
      },
    });
  }
  sortDesc() {
    this.productService.SortProductDescending(this.warehouseId).subscribe({
      next: (data) => {
        this.product = data;
      },
    });
  }
  placeOrder(id: number) {
    this.router.navigate(['/Home/addOrder'], {
      queryParams: { productId: id },
    });
  }
}
