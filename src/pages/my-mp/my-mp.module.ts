import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyMPPage } from './my-mp';

@NgModule({
    declarations: [MyMPPage],
    imports: [
        IonicPageModule.forChild(MyMPPage)
    ]
})
export class MyMPPageModule { }