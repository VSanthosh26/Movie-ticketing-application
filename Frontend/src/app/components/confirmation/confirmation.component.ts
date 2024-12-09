import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{
  
  movieName: string = ''; // Declare movieName property
  theatreName: string = ''; // Declare theatreName property
  selectedDate: string = ''; // Declare selectedDate property
  selectedTime: string = ''; // Declare selectedTime property
  selectedSeatsText: string = ''; // Declare selectedSeats property
  totalFare: number = 0; // Declare totalFare property
  bookingDetails: any;

  constructor(private route:ActivatedRoute,private router:Router,private bookingDataService:BookingService){
  }
  ngOnInit(): void {
    // Subscribe to the booking details
    this.bookingDataService.bookingDetails$.subscribe((details) => {
      // Assign values to the properties
      this.movieName = details.movieName
      this.theatreName = details.theatreName;
      this.selectedDate = details.selectedDate;
      this.selectedTime = details.selectedTime;
      this.selectedSeatsText = details.selectedSeatsText;
      this.totalFare = details.totalFare;
      console.log(this.selectedSeatsText)
      
    });
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);   
  }

}
