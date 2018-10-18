import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { VehiclesProvider } from '../providers/vehicles/vehicles';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { DealsProvider } from '../providers/deals/deals';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './config';

import { NgDragDropModule } from 'ng-drag-drop';
import { HttpClientModule } from '@angular/common/http';
import {DatePipe} from '@angular/common'

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    NgDragDropModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    HttpClientModule,
    VehiclesProvider,
    FirebaseProvider,
    DealsProvider,
    DatePipe
  ]
})
export class AppModule { }
