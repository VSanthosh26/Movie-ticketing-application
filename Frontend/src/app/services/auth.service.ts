import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:44348/api/User/";
  constructor(private http:HttpClient, private router:Router) { }

  signUp(userObj:any){
    return this.http.post(`${this.baseUrl}register`,userObj);
  }
}
