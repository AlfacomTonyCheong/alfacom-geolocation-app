import { Component, Input } from '@angular/core';
import { Events, ModalController } from 'ionic-angular';

/**
 * Generated class for the NavbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  @Input('title') title: string;
  
  constructor(private events: Events, private modalCtrl: ModalController) {
  }

  async goToCreditsTab() {
    //this.events.publish('goToCreditsTab');
    const modal = this.modalCtrl.create('CreditPage');
    await modal.present();
  }
}
