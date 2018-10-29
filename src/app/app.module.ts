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
import { AgmCoreModule } from '@agm/core';

import { FirestoreProvider } from '../providers/firestore/firestore';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { HttpClientModule } from '@angular/common/http';
import {DatePipe} from '@angular/common'

import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AuthProvider } from '../providers/auth/auth';

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
    AgmCoreModule.forRoot({
      apiKey: firebaseConfig.apiKey
    }),
    ionicGalleryModal.GalleryModalModule
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
    FirestoreProvider,
    GeolocationProvider,
    DealsProvider,
    DatePipe,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
    AuthProvider
  ]
})
export class AppModule { }
