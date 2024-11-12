import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { RouterLink, RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { AddWarehouseComponent } from './add-warehouse/add-warehouse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { OrderListComponent } from './order-list/order-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AddOrderComponent } from './add-order/add-order.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SigninComponent } from './signin/signin.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ErrorhandlingInterceptor } from './interceptor/errorhandling.interceptor';
import { Error404Component } from './error404/error404.component';
import { Error403Component } from './error403/error403.component';
import { authGuard } from './guards/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { DatePipe } from '@angular/common';
import { loginGuard } from './guards/login.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const route: Routes = [
  { path: '', component: SigninComponent, canActivate: [loginGuard] },
  {
    path: 'Home',
    component: HomePageComponent,
    canActivate: [authGuard],
    children: [
      { path: 'WareHouseList', component: WarehouseListComponent },
      { path: 'addWarehouse', component: AddWarehouseComponent },
      { path: 'ProductList', component: ProductListComponent },
      { path: 'addProduct', component: AddProductComponent },
      { path: 'orderlist', component: OrderListComponent },
      { path: 'addOrder', component: AddOrderComponent },
      { path: 'addUser', component: AddUserComponent },
      { path: 'userList', component: UserListComponent },
      { path: 'error404', component: Error404Component },
      { path: 'error403', component: Error403Component },
      { path: 'UserProfile', component: UserProfileComponent },
      { path: 'ChangePassword', component: ChangePasswordComponent },
    ],
  },
  { path: '**', component: HomePageComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    WarehouseListComponent,
    AddWarehouseComponent,
    ProductListComponent,
    AddProductComponent,
    OrderListComponent,
    AddOrderComponent,
    AddUserComponent,
    SigninComponent,
    HomePageComponent,
    Error404Component,
    Error403Component,
    UserListComponent,
    UserProfileComponent,
    ChangePasswordComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    RouterModule.forRoot(route),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    RouterLink,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorhandlingInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
