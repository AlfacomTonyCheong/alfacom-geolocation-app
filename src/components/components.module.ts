import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { IonicModule } from 'ionic-angular';
import { NavbarComponent } from './navbar/navbar';
import { GeolocationWatcherComponent } from './geolocation-watcher/geolocation-watcher';
@NgModule({
	declarations: [GoogleMapComponent,
    NavbarComponent,
    GeolocationWatcherComponent],
	imports: [
		IonicModule
	],
	exports: [GoogleMapComponent,
    NavbarComponent,
    GeolocationWatcherComponent]
})
export class ComponentsModule {}
