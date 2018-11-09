import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavParams,ModalController,ViewController,Slides, Toast, ToastController } from 'ionic-angular';
import { ComplaintsProvider } from '../../providers/complaints/complaints';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IComplaintCategory, IComplaint, IComplaintComment, IComplaintLike, IMPComplaint, IMP } from '../../interface/complaint.interface';
import { ComplaintCategory,ComplaintType, ComplaintLikeType } from '../../app/enums';
import * as moment from 'moment';
import { Timestamp } from '@firebase/firestore-types';import { FirestoreProvider } from '../../providers/firestore/firestore';
import { first } from 'rxjs/operators';
;

/**
 * Generated class for the ComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mp-complaint-modal-list',
  templateUrl: 'mp-complaint-list-modal.html',
})
export class MPComplaintListModalPage implements OnInit {
  @ViewChild('slides') slides: Slides;

  public imgRoot:string = "assets/imgs/mpComplaints/"
  public selectedCategory: number;
  public selectedIcon: any = { Id: ComplaintCategory.Traffic, ImgUrl: "https://cdn4.iconfinder.com/data/icons/transport-56/30/Traffic_Jam-512.png", Name: "Traffic", SubCategories: [] }
  public secondPage: boolean = false;
  public description: string = "";
  public captures: Array<any> = [];
  public allCategories:AngularFirestoreCollection<IComplaintCategory>;
  public allComplaints:any;
  mp: IMP;
  currentComplaint: IComplaint;
  currentComplaintId: string;
  currentComplaintSocialData: any;
  currentComplaintImages: any[] = [];
  currentComplaintComments: AngularFirestoreCollection<IComplaintComment>;
  currentComplaintLikes: AngularFirestoreCollection<IComplaintLike>;
 
  public constructor(public viewCtrl: ViewController,public modalCtrl: ModalController,
    private complaintsProvider: FirestoreProvider,public navParams: NavParams,public toastCtrl:ToastController) {
      this.mp = this.navParams.get('mp');
      this.getMPComplaints()
  }

  public ngOnInit() { this.captures = []; }

  public ngAfterViewInit() {
    this.getComplaintCategories();
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

  getImgSrc(name: string) {
    if (name) {
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  getComplaintCategories(){
    // this.allCategories = <any>this.complaintsProvider.GetComplaintCategories().valueChanges();
    this.allCategories = <any>this.complaintsProvider.GetComplaintCategories(ComplaintType.MP);
    
  }


  
  getMPComplaints(){
    this.allComplaints = <any>this.complaintsProvider.GetMPComplaints(this.mp.id);
  }

  getSocialData(complaint: any) {
    this.complaintsProvider.GetSocialData(complaint.id.toString()).then((data) => { complaint.socialData = data })
    return complaint;
  }

  onLikeBtnClick(complaint: any) {
    complaint.likeBtnDisabled = true;
    this.complaintsProvider.GetIfLikeExistsByUser(complaint.id, 'System').pipe(first()).subscribe((exists) => {
      if (exists[0] == true) {
        this.complaintsProvider.DeleteLike(complaint.id, 'System');
      }
      else {
        var like: IComplaintLike = {
          type: ComplaintLikeType.Like,
          createdBy: 'System'
        }
        this.complaintsProvider.AddNewLike(complaint.id, like);
      }
    })
    setTimeout(() => { this.getSocialData(complaint);complaint.likeBtnDisabled = false }, 3000);
  }


  async showCommentsModal(complaint) {
    var comments = this.complaintsProvider.GetComments(complaint.id);
    var modalPage = this.modalCtrl.create(
      'ComplaintCommentsPage',
      {
        complaint:complaint,
        complaintSocialData:complaint.socialData,
        commentId: complaint.id,
        comments: comments,
        type: ComplaintType.MP
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );

    await modalPage.present();

    modalPage.onDidDismiss(data=>{
      complaint = this.getSocialData(complaint)
    })
  }

  async showComplaintModal(){
    var modalPage = this.modalCtrl.create(
      'MPComplaintModalPage',
      {
        
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );

    await modalPage.present();

    modalPage.onDidDismiss(data => {
      if (data && data.submitted) {
        var newComplaint = {
          category: data.category,
          categoryName:data.categoryName,
          subject: data.subject,
          description: data.description,
          mpId: this.mp.id,
          createdBy: 'System'
        };
        this.complaintsProvider.AddNewMPComplaint(newComplaint);
        this.showToast("Complaint successfully submitted!")
        
      }
  });
  }

  

  toast: Toast;
  async showToast(msg: string) {
    this.toast = this.toastCtrl.create({ message: msg, position: 'bottom', duration: 3000 });
    await this.toast.present();
  }

  getMomentFromNow(date: Timestamp) {
    if (date){
      return moment(date.toDate()).fromNow();
    }else{
      return ''
    }
    
  }
}
