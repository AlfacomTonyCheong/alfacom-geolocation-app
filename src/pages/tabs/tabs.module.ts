import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { ComponentsModule } from '../../components/components.module';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TabsPage),
    SuperTabsModule
  ],
})
export class TabsPageModule { }
