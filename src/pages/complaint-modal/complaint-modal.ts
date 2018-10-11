import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ViewController,Slides } from 'ionic-angular';
declare var $ :any;
declare var window;

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
export class ComplaintModalPage  implements OnInit {
  @ViewChild('slides') slides: Slides;
  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;
  public selectedCategory: number;
  public captures: Array<any> = [];
  public categories:Array<any> = 
  [[{Id:1,ImgUrl:"https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png",Name:"Traffic"},
  {Id:2,ImgUrl:"https://static.thenounproject.com/png/16017-200.png",Name:"Trees"},
  {Id:3,ImgUrl:"https://static.thenounproject.com/png/35166-200.png",Name:"Walkways"},
  {Id:4,ImgUrl:"https://image.flaticon.com/icons/svg/55/55166.svg",Name:"Highway"},
  {Id:5,ImgUrl:"https://static.thenounproject.com/png/95044-200.png",Name:"Car Breakdown"},
  {Id:6,ImgUrl:"https://static.thenounproject.com/png/753-200.png",Name:"Potholes"}],[
  {Id:7,ImgUrl:"https://image.flaticon.com/icons/svg/55/55166.svg",Name:"Highway"},
  {Id:8,ImgUrl:"https://static.thenounproject.com/png/95044-200.png",Name:"Car Breakdown"},
  {Id:9,ImgUrl:"https://static.thenounproject.com/png/753-200.png",Name:"Potholes"},
  {Id:10,ImgUrl:"https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png",Name:"Traffic"},
  {Id:11,ImgUrl:"https://static.thenounproject.com/png/16017-200.png",Name:"Trees"},
  {Id:12,ImgUrl:"https://static.thenounproject.com/png/35166-200.png",Name:"Walkways"}]
  ];


  public constructor(public viewCtrl: ViewController) {
  }

  public ngOnInit() { }

  public ngAfterViewInit() {
    console.log(this.categories)
      //for desktop

      // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      //         this.video.nativeElement.src = window.URL.createObjectURL(stream);
      //         this.video.nativeElement.play();
      //     });
      // }
  }

  public capture() {
      var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 360);
      this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  }

  readUrl(event:any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let img of event.target.files){
        var reader = new FileReader();
  
        reader.onload = (event: ProgressEvent) => {
          this.captures.push((<FileReader>event.target).result) 
        }
    
        reader.readAsDataURL(img);
      }
      
      
      
    }
    console.log(this.captures)
  }

  triggerInput(){
    $("#imgInput").trigger('click');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  prevSlide() {
    this.slides.slidePrev();
  }

  selectCategory(id){
    this.selectedCategory = id;
    console.log(this.selectedCategory)
  }
}
