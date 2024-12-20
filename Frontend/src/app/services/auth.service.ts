import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:44348/api/User/";
  private userPayload:any;
  constructor(private http:HttpClient, private router:Router,private userStore:UserStoreService) {
    this.userPayload = this.decodedToken();
   }

  signUp(userObj:any){
    return this.http.post(`${this.baseUrl}register`,userObj);
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  signIn(loginObj : any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }
  
  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;
  }

  getUserIdFromToken(): number | null {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token) {
      const decodedToken = jwtHelper.decodeToken(token);
      console.log('Decoded Token:', decodedToken);
      return decodedToken ? parseInt(decodedToken['UserId'], 10) : null;
    }
    return null;
  }
}
