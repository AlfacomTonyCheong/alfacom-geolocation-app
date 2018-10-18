import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { IGoogleMapComponentOptions } from '../../interface/common.interface';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
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
    // (<any>$('st-actionContainer')).launchBtn( { openDuration: 500, closeDuration: 300 } ); 

  }

  openModal(){
    var modalPage = this.modalCtrl.create(
      'ComplaintModalPage',
      {
        
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );
    modalPage.present();

    modalPage.onDidDismiss(data => {
      console.log(data)
      if (data.submitted){
        alert("Complaint successfully submitted!")
      }
    })
  }
}
