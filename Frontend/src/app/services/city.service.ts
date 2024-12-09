import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http:HttpClient) { }

   //  API endpoint to fetch city names from the backend
   private cityApiUrl = 'https://localhost:44348/api/city/';
   private cityName$ = new BehaviorSubject<any>("");

   // Fetch city names
   getCities() {
     return this.http.get<string[]>(this.cityApiUrl);
   }

   public getCityFromStore(){
    return this.cityName$.asObservable();
  }

  public setCityForStore(val:any){
    this.cityName$.next(val)  
  }
}
