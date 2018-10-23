import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IGoogleMapComponentOptions } from '../../interface/common.interface';

/**
 * Generated class for the MGoogleMapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m-google-maps',
  templateUrl: 'm-google-maps.html',
})
export class MGoogleMapsPage {

  options: IGoogleMapComponentOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.options = {
      controls: {
        searchbar: true,
        locationUpdate: true,
        recenter: true
      },
      marker: {
        currentPos: true,
        draggable: true,
        tapToPlace: true
      }
    }
  }

  ionViewDidLoad() {
  }

  closeModal = () => {
    this.viewCtrl.dismiss();
  }
}
