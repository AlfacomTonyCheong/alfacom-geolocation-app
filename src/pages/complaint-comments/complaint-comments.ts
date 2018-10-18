import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ComplaintCommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-comments',
  templateUrl: 'complaint-comments.html',
})
export class ComplaintCommentsPage {
  comments;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.comments = this.navParams.get('comments').valueChanges();
  }

  ionViewDidLoad() {
    
  }

}
