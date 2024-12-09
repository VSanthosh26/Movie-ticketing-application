import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatingService {
  private apiUrl = 'https://localhost:44348/api/Seating';
  constructor(private http:HttpClient) { }

  getBookedSeats(
    theatreName: string, 
    movieName: string, 
    selectedDate: string, 
    selectedTime: string
  ): Observable<string[]> {
    const params = new HttpParams()
      .set('theatreName', theatreName)
      .set('movieName', movieName)
      .set('selectedDate', selectedDate)
      .set('selectedTime', selectedTime);

    return this.http.get<any>(`${this.apiUrl}/bookedseats`, { params });
  }
}
