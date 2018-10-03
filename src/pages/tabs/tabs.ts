import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  tabRoots = [
    { root: 'ComplaintPage', title: 'Complaint', icon: 'sad' },
    { root: 'CompoundPage', title: 'Compound', icon: 'car' },
    { root: 'HomePage', title: 'Home', icon: 'home' },
    { root: 'CreditPage', title: 'Credit', icon: 'card' },
    { root: 'ProfilePage', title: 'Profile', icon: 'contact' }
  ]
  selectedTabIndex: number = 2; // The index of the tab that is selected when the component is initialized
  pageTitle: string;
  
  constructor(private events: Events) {
    this.initEvents();
  }

  ionViewDidLoad() {
    this.pageTitle = this.tabRoots[this.selectedTabIndex].title;
  }

  onTabSelect(ev) {
    this.pageTitle = this.tabRoots[ev.index].title;
  }

  initEvents(){
    this.events.subscribe('goToCreditsTab', () => { this.selectTab(3); })
  }

  selectTab(tabIndex: number) {
    this.superTabs.slideTo(tabIndex);
  }
}
