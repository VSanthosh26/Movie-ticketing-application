import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingDetails: any = {};
  private bookingDetailsSubject = new BehaviorSubject<any>(null);
  bookingDetails$ = this.bookingDetailsSubject.asObservable();
  private apiUrl = 'https://localhost:44348/api/Booking';
  
  constructor(private http:HttpClient) { }

  setBookingDetails(details: any) {
    this.bookingDetailsSubject.next(details);
  }
  getBookingDetails(): any {
    console.log('Getting Booking Details:', this.bookingDetails);
    return this.bookingDetails;
  }
  sendBookingDetailsToBackend(bookingDetails: any) {
    const backendUrl = 'https://localhost:44348/api/Booking'; 
    return this.http.post(backendUrl, bookingDetails);
  }

  getUserBookings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
