import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

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
  
  constructor(private events: Events) {
  }

  goToCreditsTab() {
    this.events.publish('goToCreditsTab');
  }
}
