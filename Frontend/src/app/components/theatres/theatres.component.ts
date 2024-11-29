import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import moment from 'moment';
import { TheatresService } from '../../services/theatres.service';

@Component({
  selector: 'app-theatres',
  templateUrl: './theatres.component.html',
  styleUrl: './theatres.component.css'
})
export class TheatresComponent implements OnInit{
  theatres: any[] = [];
  theatreFilter: string = '';
  filteredTheatres: any[] = [];
  dates: string[] = [];
  selectedDate: string = moment().format('DD MMM ddd');
  showTimes: string[] = [];
  movieName: string = '';

  
  constructor(private route:ActivatedRoute,private router:Router,private movieService:MovieService,private theatreService:TheatresService){}
  ngOnInit(): void {
    this.generateDates();
    this.updateShowTimes();
    this.getTheatres();
  }

  filterTheatres() {
    if (this.theatreFilter) {
      this.filteredTheatres = this.theatres.filter((theatre: any) =>
        theatre.theatreName.toLowerCase().includes(this.theatreFilter.toLowerCase())
      );
    } else {
      this.filteredTheatres = this.theatres; // If search input is empty, show all theatres
    }
  }

  generateDates() {
    const today = moment();
    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, 'days');
      const formattedDate = date.format('DD MMM ddd');
      this.dates.push(formattedDate);
    }
  }

  selectDate(date: string) {
    this.selectedDate = date;
    this.updateShowTimes();
  }

  generateShowTimes(): string[] {
    const showTimes: string[] = [];
    let showTime = moment(this.selectedDate, 'DD MMM ddd').hour(9).minute(45); // First show time
    const currentTime = moment(); // Current system time

    // Generate show times for the day (e.g., four shows)
    for (let i = 0; i < 4; i++) {
      if (currentTime.isBefore(showTime)) {
        showTimes.push(showTime.format('h:mm A'));
      }
      showTime = showTime.add(230, 'minutes'); // Increment shows
    }

    return showTimes;
  }

  updateShowTimes() {
    const currentDate = moment();
    const selectedDateMoment = moment(this.selectedDate, 'DD MMM ddd');
    const selectedDateEnd = selectedDateMoment.clone().endOf('day');

    if (currentDate.isBefore(selectedDateEnd)) {
      this.showTimes = this.generateShowTimes();
    } else {
      this.showTimes = [];
    }
  }

  getTheatres() {
    const movieIdParam = this.route.snapshot.paramMap.get('movieId');
    if (movieIdParam !== null) {
      const movieId = +movieIdParam;
      if (!isNaN(movieId)) {
        this.theatreService.getTheatresByMovie(movieId).subscribe(
          (data: any) => {
            if (Array.isArray(data.$values)) {
              this.theatres = data.$values;
              this.filteredTheatres = this.theatres;
  
              // Fetch movie details asynchronously and set the movieName
              this.getMovieDetails(movieId);
            } else {
              console.error('Unexpected data structure:', data);
            }
          },
          (error) => {
            console.error('Error fetching theatres:', error);
          }
        );
      } else {
        console.error('Invalid movieId:', movieIdParam);
      }
    } else {
      console.error('movieId is null.');
    }
  }
  
  getMovieDetails(movieId: number) {
    this.movieService.getMovieById(movieId).subscribe(
      (selectedMovie: any) => {
        this.movieName = selectedMovie.title;
        console.log(this.movieName);
      },
      (movieError) => {
        console.error('Error fetching movie details:', movieError);
      }
    );
  }
  

   handleShowTimeClick(time: string, theatreName: string , movieName:string) {
    console.log(`You  have Booked  the show  at ${theatreName}: ${time}`);
    const queryParams = { date: this.selectedDate, time,theatreName,movieName };
    // Navigate to the BookingComponent with the selected date, time, and theatre name as parameters
    this.router.navigate(['/booking'], { queryParams });
}

}
