import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './pages/auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyordersComponent } from './pages/profile/myorders/myorders/myorders.component';
import { MyfavouriteComponent } from './pages/profile/myfavourite/myfavourite/myfavourite.component';
import { MyprofileComponent } from './pages/profile/myprofile/myprofile/myprofile.component';
import { AddressComponent } from './pages/profile/address/address/address.component';
import { PaymentComponent } from './pages/profile/payment/payment/payment.component';
import { OverviewComponent } from './pages/dashboard/overview/overview/overview.component';
import { DatabaseComponent } from './pages/dashboard/database/database/database.component';

const routes: Routes = [
  { path: '', redirectTo: '/home',  pathMatch:'full'},
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent, children:[
    { path: 'overview', component: OverviewComponent},
    { path: 'database', component: DatabaseComponent},

  ]},
  { path: 'singup', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] , children: [
    { path: 'orders', component: MyordersComponent},
    { path: 'favourites', component: MyfavouriteComponent},
    { path: 'editprofile', component: MyprofileComponent},
    { path: 'address', component: AddressComponent},
    { path: 'payment', component: PaymentComponent},
  ]},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
