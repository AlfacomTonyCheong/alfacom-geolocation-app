import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events, ToastController } from 'ionic-angular';
import { SuperTabs, SuperTabsController } from 'ionic2-super-tabs';

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
    { id: 'tab-complaint', root: 'ComplaintPage', title: 'Complaint', icon: 'sad' },
    { id: 'tab-compound', root: 'CompoundPage', title: 'Compound', icon: 'car' },
    { id: 'tab-home', root: 'HomePage', title: 'Home', icon: 'home' },
    { id: 'tab-credit', root: 'CreditPage', title: 'Credit', icon: 'card' },
    { id: 'tab-profile', root: 'ProfilePage', title: 'Profile', icon: 'contact' },
    { id: 'tab-my-mp', root: 'MyMPPage', title: 'My MP', icon: 'contact' }
  ]
  selectedTabIndex: number = 2; // The index of the tab that is selected when the component is initialized
  pageTitle: string;
  
  constructor(private superTabsCtrl: SuperTabsController, private events: Events, private toastCtrl: ToastController) {
    this.initEvents();
  }

  ionViewDidLoad() {
    this.pageTitle = this.tabRoots[this.selectedTabIndex].title;
    this.superTabsCtrl.enableTabSwipe('tab-complaint', false);
    this.checkAppForUpdates();
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

  checkAppForUpdates(){
    window['isUpdateAvailable'].then((isAvailable) => {
      if(isAvailable){
        const toast = this.toastCtrl.create({
          message: 'A new update is available. Reload the webapp to get the latest version.',
          position: 'bottom',
          showCloseButton: true,
          cssClass: 'on-tabs'
        });
        toast.present();
      }
    })
  }
}
