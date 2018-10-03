import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompoundPage } from './compound';

@NgModule({
  declarations: [
    CompoundPage,
  ],
  imports: [
    IonicPageModule.forChild(CompoundPage),
  ],
})
export class CompoundPageModule {}
