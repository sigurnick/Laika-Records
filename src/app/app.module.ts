import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from './../environments/firebase-config';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
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

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FireDBService } from './services/fire-db.service';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
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
    AddItemModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,


    // provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // provideStorage(() => getStorage()),







  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
