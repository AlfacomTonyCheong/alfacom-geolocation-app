import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealsModalPage } from './deals-modal';

@NgModule({
  declarations: [
    DealsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DealsModalPage),
  ],
})
export class DealsModalPageModule {}
