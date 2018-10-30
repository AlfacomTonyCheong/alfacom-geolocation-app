import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPComplaintModalPage } from './mp-complaint-modal';

@NgModule({
  declarations: [
    MPComplaintModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MPComplaintModalPage),
  ],
})
export class MPComplaintModalPageModule {}
