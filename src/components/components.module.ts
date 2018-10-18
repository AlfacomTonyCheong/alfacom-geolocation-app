import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { IonicModule } from 'ionic-angular';
import { NavbarComponent } from './navbar/navbar';
import { GeolocationWatcherComponent } from './geolocation-watcher/geolocation-watcher';
import { GoogleMapAgmComponent } from './google-map-agm/google-map-agm';
import { AgmCoreModule } from '@agm/core';

@NgModule({
	declarations: [GoogleMapComponent,
    NavbarComponent,
    GeolocationWatcherComponent,
    GoogleMapAgmComponent],
	imports: [
        IonicModule,
        AgmCoreModule
	],
	exports: [GoogleMapComponent,
    NavbarComponent,
    GeolocationWatcherComponent,
    GoogleMapAgmComponent]
})
export class ComponentsModule {}
