import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  userId: number | null = null;
  constructor(private userStore:UserStoreService,private bookingData:BookingService,private auth:AuthService){}

  ngOnInit(): void {
    this.userId = this.auth.getUserIdFromToken();
    console.log("this is the userId=",this.userId);
    
    if (this.userId) {
      this.loadBookingHistory();
    }
  }

  loadBookingHistory() {
    this.bookingData.getUserBookings(this.userId!)
      .subscribe({
        next: (response: any) => {
          // Handle .NET serialization and ensure array
          this.bookings = response.$values || response;
        },
        error: (error) => {
          console.error('Error fetching booking history', error);
          this.bookings = [];
        }
      });
  }

}
