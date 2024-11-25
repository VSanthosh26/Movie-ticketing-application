import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  public movies:any[] =[];
  constructor(private movieservice:MovieService){}
  ngOnInit() {
    this.movieservice.getMovies().subscribe((data:any[])=>{
      this.movies=data;
    })
  }


}
