import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ViewController,Slides, PopoverController } from 'ionic-angular';

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deals-modal',
  templateUrl: 'deals-modal.html',
})
export class DealsModalPage  implements OnInit {
  @ViewChild('slides') slides: Slides;
  suggestions:any[] = [];
  selectedItem:any;
  imgRoot:string = "assets/imgs/deals/"
  initialIndex: number= 0;
  shareObj = {
    subject: "Parkir",
    text: "Please check this out!",
    link: window.location.href
  }

  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.suggestions = this.navParams.get('suggestions');
    this.initialIndex = this.navParams.get('index')
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
    if (this.initialIndex > -1){
      this.selectedItem = this.suggestions[this.initialIndex]
      if (this.slides){
        console.log('slides')
        this.selectItem(this.suggestions[this.initialIndex],this.initialIndex )
      }
    }else{
      this.selectedItem = this.suggestions[0]
    }
}

  public ngOnInit() {
    
  }


  public ngAfterViewInit() {
    
    
  }

  getImgSrc(name:string){
    if (name || name == '0'){
      return this.imgRoot + name.toString().toLowerCase() + '.jpg'
    }
  }

  selectItem(item,idx){
    this.selectedItem = item;
    this.selectedItem.index = idx;
    this.nextSlide();
  }

  nextSlide() {
    console.log('nextSLide')
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  prevSlide() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  closeModal(){
    this.viewCtrl.dismiss({'submitted':true});
  }

  share(){
    let newVariable: any;

    newVariable = window.navigator;
    if(newVariable && newVariable.share) {
      
      newVariable.share({
        title: this.shareObj.subject,
        text: this.shareObj.text,
        url: this.shareObj.link
      })
      .then(() => console.log('Share complete'))
      .error((error) => console.log('Could not share at this time ' +error))
    }else{
      var popover = this.popoverCtrl.create(
        'ShareModalPage',
        {
          link: this.shareObj.link
        },
        {
          showBackdrop: true,
          enableBackdropDismiss: true
        }
      );
  
      popover.present();
    }
  }
}
