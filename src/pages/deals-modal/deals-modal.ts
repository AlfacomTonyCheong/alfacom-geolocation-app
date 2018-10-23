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
  selector: 'page-deals-modal',
  templateUrl: 'deals-modal.html',
})
export class DealsModalPage  implements OnInit {
  @ViewChild('slides') slides: Slides;
  suggestions:any[] = [];
  selectedItem:any;
  imgRoot:string = "assets/imgs/deals/"


  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,public navParams: NavParams) {
    this.suggestions = this.navParams.get('suggestions');
    this.selectedItem = this.suggestions[0]
    console.log(this.suggestions)
  }

  public ngOnInit() { this.slides.lockSwipes(true);}

  public ngAfterViewInit() {
    
    
  }

  getImgSrc(name:string){
    console.log(name)
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
}
