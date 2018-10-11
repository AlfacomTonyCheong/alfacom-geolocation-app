import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintPage } from './complaint';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ComplaintPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ComplaintPage),
  ],
})
export class ComplaintPageModule {}
