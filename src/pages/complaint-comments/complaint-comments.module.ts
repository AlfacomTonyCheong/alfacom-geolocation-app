import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintCommentsPage } from './complaint-comments';

@NgModule({
  declarations: [
    ComplaintCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplaintCommentsPage),
  ],
})
export class ComplaintCommentsPageModule {}
