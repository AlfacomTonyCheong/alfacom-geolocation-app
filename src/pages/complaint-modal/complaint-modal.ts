import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavParams,ModalController,ViewController,Slides } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IComplaintCategory } from '../../interface/complaint.interface';
import { ComplaintCategory,ComplaintType } from '../../app/enums';

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-modal',
  templateUrl: 'complaint-modal.html',
})
export class ComplaintModalPage implements OnInit {
  @ViewChild('slides') slides: Slides;

  public imgRoot:string = "assets/imgs/complaints/"
  public selectedCategory: number;
  public selectedIcon: any = { Id: ComplaintCategory.Traffic, ImgUrl: "https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png", Name: "Traffic", SubCategories: [] }
  public secondPage: boolean = false;
  public locationLatLng: google.maps.LatLng;
  public location: string;
  public description: string = "";
  public captures: Array<any> = [];
  public allCategories:AngularFirestoreCollection<IComplaintCategory>;
 
  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,private complaintsProvider: FirestoreProvider,public navParams: NavParams) {
    this.location = this.navParams.get('location');
    this.locationLatLng = this.navParams.get('locationLatLng');
  }

  public ngOnInit() { this.captures = []; }

  public ngAfterViewInit() {
    this.getComplaintCategories();
    this.slides.lockSwipes(true);
      //for desktop

      // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      //         this.video.nativeElement.src = window.URL.createObjectURL(stream);
      //         this.video.nativeElement.play();
      //     });
      // }
  }

  // public capture() {
  //     var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 360);
  //     this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  // }

  readUrl(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files.length)
      if (event.target.files.length + this.captures.length < 5) {
        for (let img of event.target.files) {
          var reader = new FileReader();

          reader.onload = (event: ProgressEvent) => {
            this.captures.push((<FileReader>event.target).result)
          }

          reader.readAsDataURL(img);
        }
      } else {
        alert('Error! Only a maximum of 4 files can be uploaded.')
      }
    }
  }

  triggerInput() {
    let el: HTMLElement = document.getElementById("imgInput") as HTMLElement;
    el.click();
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
      category: this.selectedIcon.Id, // TEMP VALUE 
      description: this.description,
      images: this.captures
    });
  }

  getImgSrc(name:string){
    if (name){
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  getComplaintCategories(){
    // this.allCategories = <any>this.complaintsProvider.GetComplaintCategories().valueChanges();
    this.allCategories = <any>this.complaintsProvider.GetComplaintCategories(ComplaintType.General);
    
  }

  
}
