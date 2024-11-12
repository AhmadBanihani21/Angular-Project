import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/DTOs/Order';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl!: string;
  private orderUrl = 'api/Order';
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${this.orderUrl}`);
  }
  GetAllOrdersByWarehuseId(WarehuseId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.orderUrl}/GetAllOrderByWarehouse?warehouseId=${WarehuseId}`
    );
  }
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${this.orderUrl}`, order);
  }
  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${this.orderUrl}`, order);
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.orderUrl}?id=${id}`);
  }
  getOrderByID(id: number): Observable<Order> {
    return this.http.get<Order>(
      `${this.baseUrl}/${this.orderUrl}/GetByID?id=${id}`
    );
  }
  filterByPrice(
    minPrice: number,
    maxPrice: number,
    WarehuseId: number
  ): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.orderUrl}/FilterByOrderPrice?minValue=${minPrice}&maxValue=${maxPrice}&warehouseId=${WarehuseId}`
    );
  }
  SortProductDescending(WarehuseId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.orderUrl}/SortOrderDescending?warehouseId=${WarehuseId}`
    );
  }
  SortProductAscending(WarehuseId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.orderUrl}/SortOrderAscending?warehouseId=${WarehuseId}`
    );
  }
  filterByDate(
    stratDate: string,
    endDate: string,
    WarehuseId: number
  ): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.orderUrl}/FilterByOrderDate?startDate=${stratDate}&endDate=${endDate}&warehouseId=${WarehuseId}`
    );
  }

  // FilterByOrderDate?startDate=
}
