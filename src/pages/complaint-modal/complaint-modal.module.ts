import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintModalPage } from './complaint-modal';

@NgModule({
  declarations: [
    ComplaintModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplaintModalPage),
  ],
})
export class ComplaintModalPageModule {}
