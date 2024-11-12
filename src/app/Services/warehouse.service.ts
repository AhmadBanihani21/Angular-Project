import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { Warehouse } from 'src/DTOs/Warehouse';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  baseUrl!: string;
  private warehouseUrl = 'api/Warehouse';
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/${this.warehouseUrl}`);
  }
  addWarehouse(warehouse: Warehouse): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.warehouseUrl}`, warehouse);
  }
  updateWarehouse(warehouse: Warehouse): Observable<any> {
    return this.http.put(`${this.baseUrl}/${this.warehouseUrl}`, warehouse);
  }
  deleteWarehouse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.warehouseUrl}?id=${id}`);
  }
  getWarehouseByID(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(
      `${this.baseUrl}/${this.warehouseUrl}/GetByID?id=${id}`
    );
  }
  getWarehousesByLocation(location: string): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(
      `${this.baseUrl}/${this.warehouseUrl}/GetByLocation?location=${location}`
    );
  }
}
