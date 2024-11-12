import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/DTOs/Product';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl!: string;
  private productUrl = 'api/Product';
  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/${this.productUrl}`);
  }
  GetAllProductsByWarehuseId(WarehuseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/${this.productUrl}/GetAllProductsByWarehuseId?id=${WarehuseId}`
    );
  }
  addProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.baseUrl}/${this.productUrl}`,
      Product
    );
  }
  updateProduct(Product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.baseUrl}/${this.productUrl}`,
      Product
    );
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.productUrl}?id=${id}`);
  }
  getProductByID(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.baseUrl}/${this.productUrl}/GetByID?id=${id}`
    );
  }
  getProductsByName(name: string, WarehuseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/${this.productUrl}/GetByName?name=${name}&warehouseId=${WarehuseId}`
    );
  }
  filterByPrice(
    minPrice: number,
    maxPrice: number,
    WarehuseId: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/${this.productUrl}/FilterByProductsPrice?minValue=${minPrice}&maxValue=${maxPrice}&warehouseId=${WarehuseId}`
    );
  }
  SortProductDescending(WarehuseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/${this.productUrl}/SortProductDescending?warehouseId=${WarehuseId}`
    );
  }
  SortProductAscending(WarehuseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}/${this.productUrl}/SortProductAscending?warehouseId=${WarehuseId}`
    );
  }
}
