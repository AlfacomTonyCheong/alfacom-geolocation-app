import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditPage } from './credit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreditPage
  ],
  imports: [
    IonicPageModule.forChild(CreditPage)
  ],
})
export class CreditPageModule {}
