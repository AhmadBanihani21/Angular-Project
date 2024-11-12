import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/DTOs/Order';
import { OrderService } from '../Services/order.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Product } from 'src/DTOs/Product';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  form1!: FormGroup;
  orderId!: number;
  productId!: number;
  editMode: boolean = false;
  orders: Order[] = [];
  product!: Product;
  allProducts: Product[] = [];
  totalPrice!: number;
  orderDate!: Date;
  warehouseId = parseInt(localStorage.getItem('WarehouseId') || '0');
  paymentMethod: string[] = ['Cash', 'Credit Card', 'PayPal'];
  orderStatus: string[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {}
  ngOnInit(): void {
    // debugger;

    this.form1 = this.formBuilder.group({
      txtquantity: ['', Validators.required],
      txtcustomerDetails: ['', Validators.required],
      txtpaymentMethod: ['', Validators.required],
      txtshippingAddress: ['', Validators.required],
      txtorderStatus: ['', Validators.required],
      txtproductId: ['', Validators.required],
    });
    if (
      this.activatedRoute.snapshot.queryParams['orderId'] == undefined &&
      this.activatedRoute.snapshot.queryParams['productId'] == undefined
    ) {
      this.location.back();
    }
    this.getAllProdutcs();
    if (this.activatedRoute.snapshot.queryParams['productId'] != undefined) {
      this.productId = parseInt(
        this.activatedRoute.snapshot.queryParams['productId']
      );
      this.form1.controls['txtquantity'].setValue(this.productId);
      this.getProduct();
    }
    if (this.activatedRoute.snapshot.queryParams['orderId'] != undefined) {
      this.orderId = parseInt(
        this.activatedRoute.snapshot.queryParams['orderId']
      );

      this.editOrder();
      this.editMode = true;
    }
    if (!this.editMode) {
      this.form1.controls['txtproductId'].clearValidators();
      this.form1.controls['txtproductId'].updateValueAndValidity();
    }
  }
  AddOrder() {
    this.form1.get('txtproductId')?.disable();
    if (this.form1.valid) {
      let order = new Order();
      order.quantity = this.form1.value['txtquantity'];
      order.customerDetails = this.form1.value['txtcustomerDetails'];
      order.paymentMethod = this.form1.value['txtpaymentMethod'];
      order.shippingAddress = this.form1.value['txtshippingAddress'];
      order.orderStatus = this.form1.value['txtorderStatus'];
      // order.orderDate = new Date();
      order.productId = this.productId;
      this.orderService.addOrder(order).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'order Created',
            text: 'order added successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/orderlist']);
          });
        },
      });
    }
  }
  editOrder() {
    this.orderService.getOrderByID(this.orderId).subscribe({
      next: (data) => {
        this.form1.controls['txtquantity'].setValue(data.quantity);
        this.form1.controls['txtcustomerDetails'].setValue(
          data.customerDetails
        );
        this.form1.controls['txtpaymentMethod'].setValue(data.paymentMethod);
        this.form1.controls['txtshippingAddress'].setValue(
          data.shippingAddress
        );
        // debugger;
        this.form1.controls['txtorderStatus'].setValue(data.orderStatus);
        this.form1.controls['txtproductId'].setValue(data.productId);
        this.productId = data.productId;
        this.totalPrice = data.totalPrice;

        this.getProduct();
      },
    });
  }
  UpdateOrder() {
    if (this.form1.valid) {
      let order = new Order();
      order.id = this.orderId;

      order.quantity = this.form1.value['txtquantity'];
      order.customerDetails = this.form1.value['txtcustomerDetails'];
      order.paymentMethod = this.form1.value['txtpaymentMethod'];
      order.shippingAddress = this.form1.value['txtshippingAddress'];
      order.orderStatus = this.form1.value['txtorderStatus'];
      order.productId = this.form1.value['txtproductId'];

      this.orderService.updateOrder(order).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'order Updated',
            text: 'order Updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/orderlist']);
          });
        },
      });
    }
  }
  getProduct() {
    // debugger;s
    this.productService.getProductByID(this.productId).subscribe({
      next: (data) => (this.product = data),
    });
  }
  getAllProdutcs() {
    this.productService.GetAllProductsByWarehuseId(this.warehouseId).subscribe({
      next: (data) => (this.allProducts = data),
    });
  }
  totalPriceValue() {
    // this.getProduct();
    const quantity = Number(this.form1.value['txtquantity']);
    this.totalPrice = this.product.price * quantity;
  }
}
