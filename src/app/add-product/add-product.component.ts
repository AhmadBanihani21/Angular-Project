import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
import { Product } from 'src/DTOs/Product';
import { Warehouse } from 'src/DTOs/Warehouse';
import { WarehouseService } from '../Services/warehouse.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form1!: FormGroup;
  productId!: number;
  editMode: boolean = false;
  warehouses: Warehouse[] = [];
  warehouseId = parseInt(localStorage.getItem('WarehouseId') || '0');
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private warehouseService: WarehouseService
  ) {}
  ngOnInit(): void {
    // this.getAllWarehouses();
    this.form1 = this.formBuilder.group({
      txtname: ['', Validators.required],
      txtdescription: ['', Validators.required],
      txtprice: ['', Validators.required],
      txtstockLevels: ['', Validators.required],
      txtsku: ['', Validators.required],
      // txtwarehouseId: ['', Validators.required],
    });
    // debugger;
    if (this.activatedRoute.snapshot.queryParams['productId'] != undefined) {
      this.productId = parseInt(
        this.activatedRoute.snapshot.queryParams['productId']
      );
      this.editProduct();
      this.editMode = true;
    }
  }
  AddProduct() {
    if (this.form1.valid) {
      // debugger;
      let product = new Product();
      product.name = this.form1.value['txtname'];
      product.description = this.form1.value['txtdescription'];
      product.price = this.form1.value['txtprice'];
      product.stockLevels = this.form1.value['txtstockLevels'];
      product.sku = this.form1.value['txtsku'];
      product.warehouseId = this.warehouseId;

      this.productService.addProduct(product).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Product Created',
            text: 'Product added successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/ProductList']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create Product. Please try again.',
          });
          console.error('Error creating Product', error);
        },
      });
    }
  }
  editProduct() {
    this.productService.getProductByID(this.productId).subscribe({
      next: (data) => {
        this.form1.controls['txtname'].setValue(data.name);
        this.form1.controls['txtdescription'].setValue(data.description);
        this.form1.controls['txtprice'].setValue(data.price);
        this.form1.controls['txtstockLevels'].setValue(data.stockLevels);
        this.form1.controls['txtsku'].setValue(data.sku);
        // this.form1.controls['txtwarehouseId'].setValue(data.warehouseId);
      },
    });
  }
  UpdateProduct() {
    if (this.form1.valid) {
      // debugger;
      let product = new Product();
      product.id = this.productId;
      product.name = this.form1.value['txtname'];
      product.description = this.form1.value['txtdescription'];
      product.price = this.form1.value['txtprice'];
      product.stockLevels = this.form1.value['txtstockLevels'];
      product.sku = this.form1.value['txtsku'];
      product.warehouseId = this.warehouseId;
      this.productService.updateProduct(product).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'product Updated',
            text: 'product Updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/ProductList']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create product. Please try again.',
          });
          console.error('Error creating product', error);
        },
      });
    }
  }
  // getWarehouse() {
  //   let

  // }
}
