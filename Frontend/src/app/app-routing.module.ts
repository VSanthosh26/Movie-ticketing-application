import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MoviesComponent } from './components/movies/movies.component';
import { TheatresComponent } from './components/theatres/theatres.component';
import { BookingComponent } from './components/booking/booking.component';
import { authGuard } from './guards/auth.guard';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent, canActivate:[authGuard]},
  {path:'movies/:cityID',component:MoviesComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path:'theatre/:movieId', component:TheatresComponent},
  {path:'booking', component:BookingComponent},
  {path:'confirmation',component:ConfirmationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
