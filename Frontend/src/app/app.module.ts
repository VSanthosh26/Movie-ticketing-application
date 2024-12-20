import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CityService } from './services/city.service';
import { UserStoreService } from './services/user-store.service';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieService } from './services/movie.service';
import { TheatresComponent } from './components/theatres/theatres.component';
import { BookingComponent } from './components/booking/booking.component';
import { TheatresService } from './services/theatres.service';
import { BookingService } from './services/booking.service';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    MoviesComponent,
    TheatresComponent,
    BookingComponent,
    ConfirmationComponent,
    BookingHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
  ],
  providers: [MovieService,AuthService,CityService,UserStoreService,TheatresService,BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
