import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

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
export class ComplaintPage  {
  
  // mainBtn:any = $(".st-button-main");
  // panel:any = $(".st-panel");
  // clicks:any = 0
  // settings:any ={
  //   openDuration: 600,
  //   closeDuration: 200,
  //   rotate: true
  // };
 

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
    
    
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
      console.log('dasd')
    })
  }
}
