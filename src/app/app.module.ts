
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './pages/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyordersComponent } from './pages/profile/myorders/myorders/myorders.component';
import { MyprofileComponent } from './pages/profile/myprofile/myprofile/myprofile.component';
import { MyfavouriteComponent } from './pages/profile/myfavourite/myfavourite/myfavourite.component';
import { AddressComponent } from './pages/profile/address/address/address.component';
import { PaymentComponent } from './pages/profile/payment/payment/payment.component';
import { DatabaseComponent } from './pages/dashboard/database/database/database.component';
import { OverviewComponent } from './pages/dashboard/overview/overview/overview.component';
import { DiscogsComponent } from './pages/dashboard/discogs/discogs/discogs.component';
import { AddItemModalComponent } from './components/add-item-modal/add-item-modal.component'
import { RecordComponent } from './pages/record/record/record.component';
import { SeparateArrayStringPipe } from './pipes/separate-array-string.pipe';
import { CollectionsComponent } from './pages/profile/collections/collections/collections.component';
import { SearchbarComponent } from './components/searchbar/searchbar/searchbar.component';
import { ProductsComponent } from './pages/products/products/products.component';
import { AboutComponent } from './pages/about/about/about.component';
import { CartComponent } from './pages/cart/cart/cart.component';
import { OrdersComponent } from './pages/dashboard/orders/orders/orders.component';
import { ClientsComponent } from './pages/dashboard/clients/clients/clients.component';
import { FinancesComponent } from './pages/dashboard/finances/finances/finances.component';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    DashboardComponent,
    MyordersComponent,
    MyprofileComponent,
    MyfavouriteComponent,
    AddressComponent,
    PaymentComponent,
    DatabaseComponent,
    OverviewComponent,
    DiscogsComponent,
    AddItemModalComponent,
    RecordComponent,
    SeparateArrayStringPipe,
    CollectionsComponent,
    SearchbarComponent,
    ProductsComponent,
    AboutComponent,
    CartComponent,
    OrdersComponent,
    ClientsComponent,
    FinancesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    provideFirebaseApp(()=> initializeApp(environment.firebaseConfig)),
    provideStorage(()=> getStorage()),
    provideAuth(() => getAuth()),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


