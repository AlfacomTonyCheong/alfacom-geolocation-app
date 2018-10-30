import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavParams,ModalController,ViewController,Slides } from 'ionic-angular';
import { ComplaintsProvider } from '../../providers/complaints/complaints';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IComplaintCategory } from '../../interface/complaint.interface';
import { ComplaintCategory, ComplaintType } from '../../app/enums';
import { FirestoreProvider } from '../../providers/firestore/firestore';

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mp-complaint-modal',
  templateUrl: 'mp-complaint-modal.html',
})
export class MPComplaintModalPage implements OnInit {
  @ViewChild('slides') slides: Slides;

  public imgRoot:string = "assets/imgs/mpComplaints/"
  public selectedCategory: number;
  public selectedIcon: any = { Id: ComplaintCategory.Traffic, ImgUrl: "https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png", Name: "Traffic", SubCategories: [] }
  public secondPage: boolean = false;
  public locationLatLng: google.maps.LatLng;
  public location: string;
  public description: string = "";
  public subject:string = "";
  public captures: Array<any> = [];
  public allCategories:AngularFirestoreCollection<IComplaintCategory>;
 
  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,private complaintsProvider: FirestoreProvider,public navParams: NavParams) {

  }

  public ngOnInit() { this.captures = []; }

  public ngAfterViewInit() {
    this.getMPComplaintCategories();
    this.slides.lockSwipes(true);
  }

  closeModal() {
    this.viewCtrl.dismiss({ 'submitted': false });
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

  selectCategory(icon) {
    this.selectedIcon = icon;
    console.log(this.selectedIcon)
    this.nextSlide();
  }

  removeImage(img) {
    if (img) {
      var index = this.captures.indexOf(img, 0);
      if (index > -1) {
        this.captures.splice(index, 1);
      }
    }
  }

  submitComplaint() {
    this.viewCtrl.dismiss({
      submitted: true,
      category: this.selectedIcon.Id,
      categoryName:this.selectedIcon.Name, 
      description: this.description,
      subject: this.subject
    });
  }

  getImgSrc(name:string){
    if (name){
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  getMPComplaintCategories(){
    // this.allCategories = <any>this.complaintsProvider.GetComplaintCategories().valueChanges();
    this.allCategories = <any>this.complaintsProvider.GetComplaintCategories(ComplaintType.MP);
    
  }

  
}
