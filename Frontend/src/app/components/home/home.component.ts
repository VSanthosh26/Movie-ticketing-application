import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  public movies:any[] =[];
  constructor(private movieservice:MoviesService){}
  ngOnInit() {
    this.movieservice.getMovies().subscribe((data:any[])=>{
      this.movies=data;
    })
  }


}
