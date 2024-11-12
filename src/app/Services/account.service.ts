import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePassword } from 'src/DTOs/ChangePassword';
import { Role } from 'src/DTOs/Role';
import { Signin } from 'src/DTOs/Signin';
import { Signup } from 'src/DTOs/Signup';
import { User } from 'src/DTOs/User';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl!: string;
  private accountUrl = 'api/Account';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  Signup(SignupDTO: Signup): Observable<any> {
    return this.http.post(
      `  ${this.baseUrl}/${this.accountUrl}/Signup`,
      SignupDTO
    );
  }
  Signin(SigninDTO: Signin): Observable<any> {
    return this.http.post(
      `  ${this.baseUrl}/${this.accountUrl}/Signin`,
      SigninDTO
    );
  }
  addRole(RoleDTO: Role): Observable<any> {
    return this.http.post(
      `  ${this.baseUrl}/${this.accountUrl}/AddRole`,
      RoleDTO
    );
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(
      `  ${this.baseUrl}/${this.accountUrl}/GetAllRoles`
    );
  }
  getUserRoles(userName: string): Observable<string[]> {
    return this.http.get<string[]>(
      `  ${this.baseUrl}/${this.accountUrl}/GetUserRoles?userName=${userName}`
    );
  }
  getUserInfo(userName: string): Observable<User> {
    return this.http.get<User>(
      `  ${this.baseUrl}/${this.accountUrl}/GetUserByUsername?userName=${userName}`
    );
  }
  getUserById(userId: string): Observable<any> {
    return this.http.get(
      `  ${this.baseUrl}/${this.accountUrl}/GetUserById?userId=${userId}`
    );
  }
  updateUser(user: Signup): Observable<any> {
    return this.http.put(`  ${this.baseUrl}/${this.accountUrl}`, user);
  }
  getAllUsers(pageNumber: number, pageSize: number): Observable<User[]> {
    const url = `${this.baseUrl}/${this.accountUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<User[]>(url);
  }
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/${this.accountUrl}/GetUsersByRole?role=${role}`
    );
  }
  lockUser(userId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${this.accountUrl}/lock?userId=${userId}`
    );
  }

  unlockUser(userId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${this.accountUrl}/unlock?userId=${userId}`
    );
  }
  ChangeUserPassword(ChangePassword: ChangePassword): Observable<any> {
    return this.http.post(
      `  ${this.baseUrl}/${this.accountUrl}/ChangeUserPassword`,
      ChangePassword
    );
  }
}
