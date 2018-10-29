import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { IUser } from '../../interface/common.interface';
import { Subscription } from 'rxjs';

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

  private _subscriptions = new Subscription();

  authInitCompleted: boolean;
  user: IUser;
  loggedIn: boolean;
  loadingText: string = 'Logging In...';

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private events: Events, private cdr: ChangeDetectorRef) {
    this.initEvents();
    this.getUser();
  }

  ionViewDidLoad() {

  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  initEvents() {
    // this.events.subscribe('auth_login_completed', () => {
    //   this.navCtrl.setRoot('TabsPage');
    // });
  }

  getUser() {
    this._subscriptions.add(
      this.auth.user.subscribe((user) => {
        this.authInitCompleted = true;
        this.user = user;
        if(this.user) this.goToTabsPage();
      })
    );
  }

  goToTabsPage() {
    this.navCtrl.setRoot('TabsPage');
  }
}
