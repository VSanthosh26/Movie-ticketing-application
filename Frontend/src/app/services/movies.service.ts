import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }
  private MovieApiUrl = 'https://localhost:44348/api/Movie/';
  
  getMovies() {
    return this.http.get<string[]>(this.MovieApiUrl);
  }
}
