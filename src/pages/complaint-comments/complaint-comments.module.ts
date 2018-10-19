import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintCommentsPage } from './complaint-comments';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ComplaintCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplaintCommentsPage),
    PipesModule
  ],
})
export class ComplaintCommentsPageModule {}
