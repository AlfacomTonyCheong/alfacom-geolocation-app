import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MChooseVehiclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m-choose-vehicle',
  templateUrl: 'm-choose-vehicle.html',
})
export class MChooseVehiclePage {

  constructor(private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  } 
}
