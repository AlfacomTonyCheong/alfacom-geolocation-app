import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { IonicModule } from 'ionic-angular';
import { NavbarComponent } from './navbar/navbar';
@NgModule({
	declarations: [GoogleMapComponent,
    NavbarComponent],
	imports: [
		IonicModule
	],
	exports: [GoogleMapComponent,
    NavbarComponent]
})
export class ComponentsModule {}
