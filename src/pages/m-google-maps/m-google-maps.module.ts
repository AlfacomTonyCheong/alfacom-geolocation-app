import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MGoogleMapsPage } from './m-google-maps';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MGoogleMapsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MGoogleMapsPage),
  ],
})
export class MGoogleMapsPageModule {}
