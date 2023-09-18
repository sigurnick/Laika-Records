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
import { DiscogsComponent } from './pages/dashboard/discogs/discogs/discogs.component';
import { RecordComponent } from './pages/record/record/record.component';
import { CollectionsComponent } from './pages/profile/collections/collections/collections.component';
import { ProductsComponent } from './pages/products/products/products.component';
import { AboutComponent } from './pages/about/about/about.component';
import { CartComponent } from './pages/cart/cart/cart.component';
import { OrdersComponent } from './pages/dashboard/orders/orders/orders.component';
import { ClientsComponent } from './pages/dashboard/clients/clients/clients.component';
import { FinancesComponent } from './pages/dashboard/finances/finances/finances.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'database', component: DatabaseComponent },
  { path: 'discogs', component: DiscogsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'clients', component:ClientsComponent },
  { path: 'finances', component: FinancesComponent },

  { path: 'singup', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      { path: 'orders', component: MyordersComponent },
      { path: 'collection', component: CollectionsComponent},
      { path: 'wanted', component: MyfavouriteComponent },
      { path: 'editprofile', component: MyprofileComponent },
      { path: 'address', component: AddressComponent },
      { path: 'payment', component: PaymentComponent },
    ],
  },
  { path: 'record', component: RecordComponent},
  { path: 'record/:genre/:id', component: RecordComponent},
  { path: 'products', component: ProductsComponent},
  { path: 'about', component: AboutComponent},
  {path: 'cart', component: CartComponent},
  {path: 'cart/:id', component: CartComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
