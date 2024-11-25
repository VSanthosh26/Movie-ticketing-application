import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityService } from './city.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient,private city:CityService) { }
  private baseUrl='https://localhost:44348';
  private MovieApiUrl = 'https://localhost:44348/api/Movie/';
  
  getMovies() {
    return this.http.get<string[]>(this.MovieApiUrl);
  }

  getMoviesByCity(cityID: number) {
    const url = `${this.baseUrl}/api/Movie/ByCity/${cityID}`;
    return this.http.get(url);
    
  }
  getMovieById(id: number)  {
    const url = `${this.baseUrl}/api/Movie/${id}`;
    return this.http.get(url); 
  }
}
