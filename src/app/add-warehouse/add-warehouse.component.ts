import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Warehouse } from 'src/DTOs/Warehouse';
import { WarehouseService } from '../Services/warehouse.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.css'],
})
export class AddWarehouseComponent implements OnInit {
  form1!: FormGroup;
  warehouseId!: number;
  editMode: boolean = false;
  warehouseStatus: string[] = ['Active', 'Inactive'];
  constructor(
    private formBuilder: FormBuilder,
    private warehouseService: WarehouseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.form1 = this.formBuilder.group({
      txtLocation: ['', Validators.required],
      txtManager: ['', Validators.required],
      txtCapcity: ['', Validators.required],
      txtStatus: ['', Validators.required],
    });
    if (this.activatedRoute.snapshot.queryParams['warehouseId'] != undefined) {
      this.warehouseId = parseInt(
        this.activatedRoute.snapshot.queryParams['warehouseId']
      );
      this.editWarehouse();
      this.editMode = true;
    }
  }
  AddWarehouse() {
    if (this.form1.valid) {
      debugger;
      let warehouse = new Warehouse();
      warehouse.location = this.form1.value['txtLocation'];
      warehouse.manager = this.form1.value['txtManager'];
      warehouse.capcity = this.form1.value['txtCapcity'];
      warehouse.status = this.form1.value['txtStatus'];
      this.warehouseService.addWarehouse(warehouse).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Warehouse Created',
            text: 'Warehouse added successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/WareHouseList']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create warehouse. Please try again.',
          });
          console.error('Error creating warehouse', error);
        },
      });
    }
  }
  editWarehouse() {
    this.warehouseService.getWarehouseByID(this.warehouseId).subscribe({
      next: (data) => {
        this.form1.controls['txtLocation'].setValue(data.location);
        this.form1.controls['txtManager'].setValue(data.manager);
        this.form1.controls['txtCapcity'].setValue(data.capcity);
        this.form1.controls['txtStatus'].setValue(data.status);
      },
    });
  }
  UpdateWareHouse() {
    if (this.form1.valid) {
      debugger;
      let warehouse = new Warehouse();
      warehouse.id = this.warehouseId;
      warehouse.location = this.form1.value['txtLocation'];
      warehouse.manager = this.form1.value['txtManager'];
      warehouse.capcity = this.form1.value['txtCapcity'];
      warehouse.status = this.form1.value['txtStatus'];
      this.warehouseService.updateWarehouse(warehouse).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Warehouse Updated',
            text: 'Warehouse Updated successfully!',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/Home/WareHouseList']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create warehouse. Please try again.',
          });
          console.error('Error creating warehouse', error);
        },
      });
    }
  }
}
