import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
<<<<<<< HEAD
import { IonicPage, NavController, NavParams, ModalController, ViewController, Slides } from 'ionic-angular';
import { ComplaintCategory } from '../../app/enums';
=======
import { IonicPage, NavController, NavParams,ModalController,ViewController,Slides } from 'ionic-angular';
import { ComplaintsProvider } from '../../providers/complaints/complaints';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IComplaintCategory } from '../../interface/complaint.interface';
>>>>>>> 16567d6462304b7c330ffd9fccacbdec6b99b6ca

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
  public description: string;
  public captures: Array<any> = [];
<<<<<<< HEAD
  // public categories:Array<any> = 
  // [[{Id:1,ImgUrl:"https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png",Name:"Traffic",SubCategories:[
  //   {Id:2,ImgUrl:"https://static.thenounproject.com/png/16017-200.png",Name:"Trees"},
  // {Id:3,ImgUrl:"https://static.thenounproject.com/png/35166-200.png",Name:"Walkways"},
  // {Id:4,ImgUrl:"https://image.flaticon.com/icons/svg/55/55166.svg",Name:"Highway"},
  // {Id:5,ImgUrl:"https://static.thenounproject.com/png/95044-200.png",Name:"Car Breakdown"},
  // {Id:6,ImgUrl:"https://static.thenounproject.com/png/753-200.png",Name:"Potholes"}
  // ]},
  // {Id:2,ImgUrl:"https://static.thenounproject.com/png/16017-200.png",Name:"Trees",SubCategories:[]},
  // {Id:3,ImgUrl:"https://static.thenounproject.com/png/35166-200.png",Name:"Walkways",SubCategories:[]},
  // {Id:4,ImgUrl:"https://image.flaticon.com/icons/svg/55/55166.svg",Name:"Highway",SubCategories:[]},
  // {Id:5,ImgUrl:"https://static.thenounproject.com/png/95044-200.png",Name:"Car Breakdown",SubCategories:[]},
  // {Id:6,ImgUrl:"https://static.thenounproject.com/png/753-200.png",Name:"Potholes",SubCategories:[]},
  // {Id:7,ImgUrl:"https://image.flaticon.com/icons/svg/55/55166.svg",Name:"Highway",SubCategories:[]},
  // {Id:8,ImgUrl:"https://static.thenounproject.com/png/95044-200.png",Name:"Car Breakdown",SubCategories:[]},
  // {Id:9,ImgUrl:"https://static.thenounproject.com/png/753-200.png",Name:"Potholes",SubCategories:[]},
  // {Id:10,ImgUrl:"https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png",Name:"Traffic",SubCategories:[]},
  // {Id:11,ImgUrl:"https://static.thenounproject.com/png/16017-200.png",Name:"Trees",SubCategories:[]},
  // {Id:12,ImgUrl:"https://static.thenounproject.com/png/35166-200.png",Name:"Walkways",SubCategories:[]}]
  // ];
  public categories: Array<any> =
    [{
      Id: ComplaintCategory.Traffic, ImgUrl: "https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png", Name: "Traffic", SubCategories: [
        { Id: ComplaintCategory.Trees, ImgUrl: "https://static.thenounproject.com/png/16017-200.png", Name: "Trees" },
        { Id: ComplaintCategory.Walkways, ImgUrl: "https://static.thenounproject.com/png/35166-200.png", Name: "Walkways" },
        { Id: ComplaintCategory.Highways, ImgUrl: "https://image.flaticon.com/icons/svg/55/55166.svg", Name: "Highway" },
        { Id: ComplaintCategory.CarBreakdown, ImgUrl: "https://static.thenounproject.com/png/95044-200.png", Name: "Car Breakdown" },
        { Id: ComplaintCategory.Potholes, ImgUrl: "https://static.thenounproject.com/png/753-200.png", Name: "Potholes" }
      ]
    },
    { Id: 2, ImgUrl: "https://static.thenounproject.com/png/16017-200.png", Name: "Trees", SubCategories: [] },
    { Id: 3, ImgUrl: "https://static.thenounproject.com/png/35166-200.png", Name: "Walkways", SubCategories: [] },
    { Id: 4, ImgUrl: "https://image.flaticon.com/icons/svg/55/55166.svg", Name: "Highway", SubCategories: [] },
    { Id: 5, ImgUrl: "https://static.thenounproject.com/png/95044-200.png", Name: "Car Breakdown", SubCategories: [] },
    { Id: 6, ImgUrl: "https://static.thenounproject.com/png/753-200.png", Name: "Potholes", SubCategories: [] },
    { Id: 7, ImgUrl: "https://image.flaticon.com/icons/svg/55/55166.svg", Name: "Highway", SubCategories: [] },
    { Id: 8, ImgUrl: "https://static.thenounproject.com/png/95044-200.png", Name: "Car Breakdown", SubCategories: [] },
    { Id: 9, ImgUrl: "https://static.thenounproject.com/png/753-200.png", Name: "Potholes", SubCategories: [] },
    { Id: 10, ImgUrl: "https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png", Name: "Traffic", SubCategories: [] },
    { Id: 11, ImgUrl: "https://static.thenounproject.com/png/16017-200.png", Name: "Trees", SubCategories: [] },
    { Id: 12, ImgUrl: "https://static.thenounproject.com/png/35166-200.png", Name: "Walkways", SubCategories: [] }
    ];


  public constructor(public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams) {
=======
  public allCategories:AngularFirestoreCollection<IComplaintCategory>;
 
  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,private complaintsProvider: ComplaintsProvider,public navParams: NavParams) {
>>>>>>> 16567d6462304b7c330ffd9fccacbdec6b99b6ca
    this.location = this.navParams.get('location');
    this.locationLatLng = this.navParams.get('locationLatLng');
  }

  public ngOnInit() { this.captures = []; }

  public ngAfterViewInit() {
<<<<<<< HEAD

    this.slides.lockSwipes(true);
    console.log(this.categories)
    //for desktop

    // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //         this.video.nativeElement.src = window.URL.createObjectURL(stream);
    //         this.video.nativeElement.play();
    //     });
    // }
=======
    this.getComplaintCategories();
    this.slides.lockSwipes(true);
      //for desktop

      // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      //         this.video.nativeElement.src = window.URL.createObjectURL(stream);
      //         this.video.nativeElement.play();
      //     });
      // }
>>>>>>> 16567d6462304b7c330ffd9fccacbdec6b99b6ca
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
      category: this.selectedIcon.Id,
      description: this.description
    });
  }

  getImgSrc(name:string){
    return this.imgRoot + name + '.png'
  }

  getComplaintCategories(){
    this.allCategories = <any>this.complaintsProvider.GetComplaintCategories().valueChanges();
  }

  
}
