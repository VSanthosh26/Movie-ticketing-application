import { Component } from '@angular/core';
import { TheatresService } from '../../services/theatres.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { BookingService } from '../../services/booking.service';


interface Seat {
  section: string;
  row: string;
  number: number;
  selected: boolean;
  locked: boolean;
  
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  numTickets: number | null = null;
  selectedSeatsCount: number = 0;
  totalFare: number = 0;
  seats: Seat[] = [];
  selectedDate: string = '';
  selectedTime: string = '';
  theatreName: string = '';
  movieName: string='';
  selectedSeatText='';
  public fullName: string = '';

  sections: any[] = [
    {
      name: 'Premium Sofa',
      price: 220,
      rows: ['A', 'B', 'C'],
      totalSeats: 50
    },
    {
      name: 'Premium Balcony',
      price: 175,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      totalSeats: 160
    },
    {
      name: 'Premium First Class',
      price: 140,
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      totalSeats: 119
    },
    {
      name: 'Non-Premium SE',
      price: 90,
      rows: ['A', 'B', 'C', 'D', 'E'],
      totalSeats: 110
    }
  ];

  constructor(private theatreService:TheatresService,private route:ActivatedRoute,private router:Router,private auth:AuthService,private userstore:UserStoreService,private bookingDataService:BookingService){
    this.initializeSeats();
    // Initialize seats based on sections
    this.route.queryParams.subscribe((params) => {
      this.selectedDate = params['date'] || '';
      this.selectedTime = params['time'] || '';
      this.theatreName = params['theatreName'] || '';
      this.movieName = params['movieName'] || '';
      this.userstore.setFullNameForStore(this.auth.getfullNameFromToken());
    this.userstore.getFullNameFromStore().subscribe(val => {
      this.fullName = val ;
      console.log(this.fullName)
    });
      console.log('Movie Name in BookingComponent:', this.movieName);
      this.initializeSeats(); // Initialize seats based on theatreName if needed
    });
  }

  initializeSeats() {
    this.clearLocalStorage(); // Clear stored seats before initialization
 const seatsFromStorage = localStorage.getItem('selectedSeats');
   
   if (seatsFromStorage) {
     // If seats are found in localStorage, use them
     this.seats = JSON.parse(seatsFromStorage);
   } else {
     // Otherwise, initialize seats based on sections
     this.sections.forEach((section) => {
       section.rows.forEach((row: string) => {
         for (let i = 1; i <= section.totalSeats; i++) {
           this.seats.push({
             section: section.name,
             row: row,
             number: i,
             selected: false,
             locked: false
           });
         }
       });
     });
   }
 }

 clearLocalStorage() {
  localStorage.removeItem('selectedSeats');
}

  updateLocalStorage() {
    localStorage.setItem('selectedSeats', JSON.stringify(this.seats));
  }

  lockSelectedSeats() {
    this.seats
      .filter((seat) => seat.selected)
      .forEach((seat) => {
        seat.locked = true;
      });
  }

  unlockSeats() {
    this.seats.forEach((seat) => {
      seat.locked = false;
    });
    this.updateLocalStorage();
  }

  onNumTicketsChange(event: any): void {
    this.numTickets = parseInt(event, 10); // Parse the event value to an integer
    this.clearSelectedSeats();
    this.updateTotalFare();
    this.lockSeatsForSelectedDateTime();
  }

  lockSeatsForSelectedDateTime(): void {
    const selectedDateTimeId = `${this.theatreName}-${this.selectedDate}-${this.selectedTime}`;
  
    this.seats.forEach((seat) => {
      const seatDateTimeId = `${this.theatreName}-${seat.row}-${seat.number}`;
      seat.locked = seatDateTimeId === selectedDateTimeId && seat.selected;
    });
  }

  clearSelectedSeats(): void {
    this.selectedSeatsCount = 0;
    this.seats.forEach((seat) => {
      if (!seat.locked) {
        seat.selected = false;
      }
    });
    this.updateLocalStorage();
  }

  getSeats(section: any, row: string): number[] {
    if (section.name === 'Premium Sofa') {
      if (row === 'A') {
        return Array.from({ length: 18 }, (_, index) => index + 1);
      } else if (row === 'B' || row === 'C') {
        return Array.from({ length: 16 }, (_, index) => index + 1);
      }
    } else if (section.name === 'Premium Balcony') {
      if (row === 'A' || row === 'B' || row === 'C' || row === 'D' || row === 'E' || row === 'F' || row === 'G' || row === 'H') {
        return Array.from({ length: 20 }, (_, index) => index + 1);
      }
    } else if (section.name === 'Premium First Class') {
      if (row === 'A') {
        return Array.from({ length: 19 }, (_, index) => index + 1);
      } else {
        return Array.from({ length: 20 }, (_, index) => index + 1);
      }
    } else if (section.name === 'Non-Premium SE') {
      if (row === 'A') {
        return Array.from({ length: 24 }, (_, index) => index + 1);
      } else {
        return Array.from({ length: 22 }, (_, index) => index + 1);
      }
    }
    return [];
  }
  
  
  isSelected(section: string, row: string, number: number): boolean {
    const seat = this.seats.find(
      (s) => s.section === section && s.row === row && s.number === number
    );

    return seat ? seat.selected : false;
  }


  
  toggleSeat(section: string, row: string, number: number): void {
    const selectedSeat = this.seats.find(
      (s) => s.section === section && s.row === row && s.number === number
    );
  
    if (selectedSeat && this.numTickets !== null) {
      if (!selectedSeat.locked) { // Check if the seat is not locked
        if (selectedSeat.selected) {
          // Deselect the seat
          selectedSeat.selected = false;
          this.selectedSeatsCount--;
        } else if (this.selectedSeatsCount < this.numTickets) {
          // Check if the user can select more seats
          selectedSeat.selected = true;
          this.selectedSeatsCount++;
        }
        this.updateTotalFare();
      }
    }
  }
  numSelectedSeats(): number {
    // Implement logic to count the number of selected seats
    return this.seats.filter((seat) => seat.selected).length;
  }
  updateTotalFare(): void {
    let totalFare = 0;
    this.seats.filter((seat) => seat.selected).forEach((seat) => {
      const section = this.sections.find((s) => s.name === seat.section);
      if (section) {
        totalFare += section.price;
      }
    });
    this.totalFare = totalFare;
  }

  isProceedButtonEnabled(): boolean {
    return this.numSelectedSeats() === this.numTickets;
  }
    proceedBooking(): void {
      const selectedSeatsBySection: { [section: string]: string[] } = {};
      const totalFare = this.totalFare;
      this.lockSelectedSeats();

      

      for (const seat of this.seats) {
        if (seat.selected) {
          const seatIdentifier = `${seat.row}-${seat.number}`;
          if (!selectedSeatsBySection[seat.section]) {
            selectedSeatsBySection[seat.section] = [];
          }
          selectedSeatsBySection[seat.section].push(seatIdentifier);
        }
      }

      const selectedSeatsText = Object.entries(selectedSeatsBySection)
        .map(([section, seats]) => `${section}: ${seats.join(', ')}`)
        .join('\n');

      if (selectedSeatsText) {

        this.bookingDataService.setBookingDetails({
          movieName: this.movieName,
          theatreName: this.theatreName,
          selectedSeatsText: selectedSeatsText,
          selectedDate: this.selectedDate,
          selectedTime: this.selectedTime,
          totalFare: totalFare,
          fullName:this.fullName
        });

        this.bookingDataService.sendBookingDetailsToBackend({
          Name:this.fullName,
          movieName: this.movieName,
          theatreName: this.theatreName,
          selectedSeatsText: selectedSeatsText,
          selectedDate: this.selectedDate,
          selectedTime: this.selectedTime,
          totalFare: totalFare,
          
        }).subscribe(
          (response) => {
            console.log('Booking details sent to the backend successfully', response);
            // Optionally, you can navigate to the confirmation page here
            this.router.navigate(['/confirmation']);
          },
          (error) => {
            console.error('Error sending booking details to the backend', error);
          }
        );
      } else {
        console.log('No seats selected.');
      }
    }

}
