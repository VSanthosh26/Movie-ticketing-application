import { Component } from '@angular/core';
import { TheatresService } from '../../services/theatres.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { BookingService } from '../../services/booking.service';
import { CityService } from '../../services/city.service';
import { SeatingService } from '../../services/seating.service';


interface Seat {
  section: string;
  row: string;
  number: number;
  status: 'available' | 'booked' | 'selected';
  price: number;
  
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
  selectedcityName: string | null = null;
  selectedCityId:string | null = null;
  userId: number | null = null;

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

  constructor(private theatreService:TheatresService,private route:ActivatedRoute,private router:Router,private auth:AuthService,private userstore:UserStoreService,private bookingDataService:BookingService,private cityService:CityService,private seatingService:SeatingService){
    this.loadSeats();
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
       // Initialize seats based on theatreName if needed
    });
  }

  ngOnInit(): void {
    this.loadSeats();
    this.userId=this.auth.getUserIdFromToken();
    this.cityService.getCityFromStore().subscribe(val=>{
      this.selectedcityName=val.Cityname,
      console.log("this is city name=",val.Cityname);
      this.selectedCityId=val.selectedCityID,
      console.log("this is cityId=",val.selectedCityID);},
    );
  }

  loadSeats() {
    // Fetch booked seats from backend
    this.seatingService.getBookedSeats(this.theatreName, this.movieName, this.selectedDate, this.selectedTime)
      .subscribe(
        (bookedSeats) => {
          console.log('Booked Seats Type:', typeof bookedSeats);
          console.log('Booked Seats:', bookedSeats);
          this.initializeSeats(bookedSeats);
        },
        (error) => {
          console.error('this is block is reaching')
          console.error('Error fetching booked seats', error);
          this.initializeSeats([]);
        }
      );
  }

  initializeSeats(bookedSeats:any) {
    this.seats=[];
    const bookedArray= bookedSeats?.$values;
    const bookedSeatsArray = Array.isArray(bookedArray) ? bookedArray : [];
    const seatsFromStorage = localStorage.getItem('selectedSeats');
      
    if (seatsFromStorage) {
     // If seats are found in localStorage, use them
     this.seats = JSON.parse(seatsFromStorage);
    } else {
     // Otherwise, initialize seats based on sections
     this.sections.forEach((section) => {
      section.rows.forEach((row: string) => {
        const seatsInRow = this.getSeats(section, row);
        seatsInRow.forEach((seatNumber) => {
          const seatKey = `${section.name}-${section.name}-${row}-${seatNumber}`;
          const seatStatus = bookedSeatsArray.some(seat => seat === seatKey) ? 'booked' : 'available';
          this.seats.push({
            section: section.name,
            row: row,
            number: seatNumber,
            status: seatStatus,
            price: section.price
          });
        });
      });
    });
   }
 }

 cancelBooking(){
  this.router.navigate(['/movies', this.selectedCityId],{
    queryParams: { fullName: this.fullName, City:this.selectedcityName }
  });
}

  clearLocalStorage() {
    localStorage.removeItem('selectedSeats');
  }

  updateLocalStorage() {
    localStorage.setItem('selectedSeats', JSON.stringify(this.seats));
  }

  onNumTicketsChange(event: any): void {
    this.numTickets = parseInt(event, 10); // Parse the event value to an integer
    this.updateTotalFare();
    this.resetSeatSelection();
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
  
  getSeatClass(sectionName: string, row: string, seatNumber: number): string {
    const seat = this.seats.find(s => s.section === sectionName && s.row === row && s.number === seatNumber);
  
    if (seat?.status === 'available') {
      return 'available';
    } else if (seat?.status === 'booked') {
      return 'booked';
    } else if (seat?.status === 'selected') {
      return 'selected';
    }
    return '';
  }


  
  toggleSeat(section: string, row: string, number: number): void {
    if (this.numTickets === null) {
      alert('Please select the number of tickets first');
      return;
    }

    const clickedSeat = this.seats.find(
      (s) => s.section === section && s.row === row && s.number === number
    );

    if (!clickedSeat || clickedSeat.status === 'booked') return;


    // If all required seats are already selected, reset previous selection
    if (this.selectedSeatsCount === this.numTickets) {
      this.resetSeatSelection();
    }

    const selectedSeats = this.selectConsecutiveSeats(section, row, number);

    
    this.updateTotalFare();
  }

  selectConsecutiveSeats(section: string, row: string, startNumber: number): Seat[] {

    if (this.numTickets === null) {
      return [];
    }
    
    const selectedSeats: Seat[] = [];
    const sectionSeats = this.seats.filter(
      s => s.section === section && s.row === row
    );

    // Sort seats in the row by seat number
    const sortedSeats = sectionSeats.sort((a, b) => a.number - b.number);
    
    // Find the index of the clicked seat
    const startIndex = sortedSeats.findIndex(
      seat => seat.number === startNumber && seat.status === 'available'
    );

    
    // If the clicked seat is not available, return empty array
    if (startIndex === -1) return selectedSeats;

    // Select seats to the right of the clicked seat
    for (let i = startIndex; i < sortedSeats.length; i++) {
      const seat = sortedSeats[i];
      
      // Stop if seat is booked or we've selected enough tickets
      if (seat.status === 'booked' || this.selectedSeatsCount >= this.numTickets) {
        break;
      }

      // Select the seat if it's available
      if (seat.status === 'available') {
        seat.status = 'selected';
        selectedSeats.push(seat);
        this.selectedSeatsCount++;
      }

      // Stop if we've selected required number of tickets
      if (this.selectedSeatsCount === this.numTickets) {
        break;
      }
    }

    return selectedSeats;
  }

  resetSeatSelection(): void {
    this.seats.forEach(seat => {
      if (seat.status === 'selected') {
        seat.status = 'available';
      }
    });
    this.selectedSeatsCount = 0;
    this.totalFare = 0;
  }

  updateTotalFare(): void {
    this.totalFare = this.seats
    .filter((seat) => seat.status === 'selected')
    .reduce((total, seat) => total + seat.price, 0);
  }

  isProceedButtonEnabled(): boolean {
    return this.selectedSeatsCount === this.numTickets; 
  }
    proceedBooking(): void {
      const selectedSeats = this.seats.filter((seat) => seat.status === 'selected');
      const selectedSeatsBySection: { [section: string]: string[] } = {};
      const totalFare = this.totalFare;

      selectedSeats.forEach((seat) => {
        const seatKey = `${seat.section}-${seat.row}-${seat.number}`;
        if (!selectedSeatsBySection[seat.section]) {
          selectedSeatsBySection[seat.section] = [];
        }
        selectedSeatsBySection[seat.section].push(seatKey);
      }); 

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
          fullName:this.fullName,
          UserId:this.userId
        });

        this.bookingDataService.sendBookingDetailsToBackend({
          Name:this.fullName,
          movieName: this.movieName,
          theatreName: this.theatreName,
          selectedSeatsText: selectedSeatsText,
          selectedDate: this.selectedDate,
          selectedTime: this.selectedTime,
          totalFare: totalFare,
          UserId:this.userId
        }).subscribe(
          (response) => {
            console.log('Booking details sent to the backend successfully', response);
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
