import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TheatresService {
  private baseUrl = 'https://localhost:44348/api/Screens';

  constructor(private http:HttpClient) { }

  getTheatersByMovie(movieId: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${movieId}`;
    return this.http.get<any>(url);
  }
}
