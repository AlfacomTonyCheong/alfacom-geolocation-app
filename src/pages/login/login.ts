import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private events: Events) {
    this.initEvents();
  }

  ionViewDidLoad() {
    
  }

  initEvents(){
    this.events.subscribe('auth_login', () => {
      this.navCtrl.setRoot('TabsPage');
    })
  }
}
