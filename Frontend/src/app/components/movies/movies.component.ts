import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit{
  movies: any[] = [];
  filteredMovies: any[] = [];
  selectedCityID: number = 1; // Change to selectedCityID as a number
  selectedCityName:string | null='';
  movieFilter: string = '';
  selectedLanguage: string = '';
  movieId: number | null = null;
  movieName: string='';

  cityMappings: { [key: number]: string } = {
    1: 'Tenali',
    2: 'Guntur',
    3: 'vijwayawada'
    // Add more city ID to name mappings as needed
  };

  constructor(private router:Router,private route:ActivatedRoute,private movieService:MovieService){}

  ngOnInit(): void {
    const cityIDParam = this.route.snapshot.paramMap.get('cityID');
    const selectCityName= this.route.snapshot.queryParamMap.get('City');
    this.selectedCityName= selectCityName;
    this.selectedCityID = cityIDParam ? +cityIDParam : 0;

    // Fetch movies for the selected city using the cityID
    this.movieService.getMoviesByCity(this.selectedCityID).subscribe(
      (data: any) => {
        if (Array.isArray(data.$values)) {
          this.movies = data.$values;
          this.filteredMovies = this.movies;
          console.log(this.movies)
        } else {
          console.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
  
  filterMovies() {
    if (this.movieFilter) {
      this.filteredMovies = this.movies.filter((movie: any) =>
        movie.title.toLowerCase().includes(this.movieFilter.toLowerCase())
      );
    } else {
      this.filteredMovies = this.movies;
    }
  }

  filterByLanguage(language: string) {
    this.selectedLanguage = language;
    this.filteredMovies = this.movies.filter((movie: any) =>
      movie.language === language
    );
  }

  bookTicket(movieId: number) {
    // Find the selected movie by its ID
    const selectedMovie = this.movies.find((movie: any) => movie.movieID === movieId);
    
    if (selectedMovie) {
      const movieName = selectedMovie.title;
      console.log(`Selected Movie ID: ${movieId}, Movie Name: ${movieName}`);
      // You can now navigate to the theaters component with the movie ID as a parameter
      this.router.navigate(['theaters', movieId], { queryParams: { movieName } });
    } else {
      console.error(`Movie with ID ${movieId} not found.`);
    }
  }
}
