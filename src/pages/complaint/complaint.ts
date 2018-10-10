import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IGoogleMapComponentOptions } from '../../interface/common';

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html',
})
export class ComplaintPage {
  options: IGoogleMapComponentOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.options = {
      controls: {
        recenter: true,
        searchbar: true,
        complaint: true
      }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintPage');
  }

}
