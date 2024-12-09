import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http:HttpClient) { }

   //  API endpoint to fetch city names from the backend
   private cityApiUrl = 'https://localhost:44348/api/city/';

   // Fetch city names
   getCities() {
     return this.http.get<string[]>(this.cityApiUrl);
   }
}
