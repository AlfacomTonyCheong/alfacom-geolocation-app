import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ViewController,Slides } from 'ionic-angular';

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-modal',
  templateUrl: 'share-modal.html',
})
export class ShareModalPage  implements OnInit {
  @ViewChild('slides') slides: Slides;
  suggestions:any[] = [];
  selectedItem:any;
  imgRoot:string = "assets/imgs/deals/"
  initialIndex: number= 0;
  shareObj = {
    subject: "Parkir",
    text: "Please check this out!",
    link: ""
  }


  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,public navParams: NavParams) {
    this.shareObj.link = this.navParams.get('link');
  }

  ionViewDidEnter() {
}

  public ngOnInit() {
    
  }


  public ngAfterViewInit() {
    
    
  }

  closeModal(){
    this.viewCtrl.dismiss({'submitted':true});
  }
}
