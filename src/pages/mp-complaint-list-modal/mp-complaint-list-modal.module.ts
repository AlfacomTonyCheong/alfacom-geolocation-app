import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPComplaintListModalPage } from './mp-complaint-list-modal';

@NgModule({
  declarations: [
    MPComplaintListModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MPComplaintListModalPage),
  ],
})
export class MPComplaintListModalPageModule {}
