import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicPage, AlertController, ModalController, Events, ToastController } from 'ionic-angular';
import { VehiclesProvider } from '../../providers/vehicles/vehicles';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { DealsProvider } from '../../providers/deals/deals';
import { ComplaintsProvider } from '../../providers/complaints/complaints';
import { IComplaint, IComplaintLike, IComplaintComment } from '../../interface/complaint.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@IonicPage()
@Component({
  selector: 'page-my-mp',
  templateUrl: 'my-mp.html'
})
export class MyMPPage {
  imgRoot:string = "assets/imgs/MP/"
  mp:any[] = [
    {Name:'Y.B. Tuan Lai Wai Chong',Area:'N22 Teratai',ImgName:'lai'},
    {Name:'Y.B. Tuan Ir Izham Bin Hashim',Area:'N21 Pandan Indah',ImgName:'izham'},
    {Name:'Y.B. Puan Haniza Binti Mohamed ',Area:'N20 Lembah Jaya',ImgName:'haniza'}
  ]
  currentComplaint: IComplaint;
  currentComplaintId: string;
  currentComplaintSocialData: any;
  currentComplaintComments: AngularFirestoreCollection<IComplaintComment>;
  currentComplaintLikes: AngularFirestoreCollection<IComplaintLike>;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private events: Events,
    private geolocation: Geolocation,
    private firebaseProvider: FirebaseProvider,
    private dealsProvider: DealsProvider,
    private ref: ChangeDetectorRef,
    private complaintsProvider: ComplaintsProvider
  ) {

  }

  ionViewDidLoad() {
    //this.initGeolocationWatcher();
    //this.firebaseDoc = this.firebaseProvider.getDocRef('temp/mANmENJSsGo6DZ0Xx8Hn').valueChanges();
    //this.firebaseCollection = this.firebaseProvider.getCollectionRef('temp').valueChanges();
  }

  ionViewDidLeave() {
  }

  getImgSrc(name:string){
    if (name){
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  viewComplaints(mp:any){
    if (mp){
      this.currentComplaintComments = this.complaintsProvider.GetComments(this.currentComplaintId);
    
        var modalPage = this.modalCtrl.create(
          'ComplaintCommentsPage',
          {
            commentId: this.currentComplaintId,
            comments: this.currentComplaintComments
          },
          {
            showBackdrop: true,
            enableBackdropDismiss: true
          }
        );
    
        modalPage.present();
    }
  }

 
}
