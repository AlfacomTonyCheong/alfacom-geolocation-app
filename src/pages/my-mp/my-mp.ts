import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicPage, AlertController, ModalController, Events, ToastController } from 'ionic-angular';
import { VehiclesProvider } from '../../providers/vehicles/vehicles';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { DealsProvider } from '../../providers/deals/deals';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { IComplaint, IComplaintLike, IComplaintComment, IMP } from '../../interface/complaint.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@IonicPage()
@Component({
  selector: 'page-my-mp',
  templateUrl: 'my-mp.html'
})
export class MyMPPage {
  imgRoot:string = "assets/imgs/MP/"
  mp:AngularFirestoreCollection<IMP>;
  currentComplaint: IComplaint;
  currentComplaintId: string;
  currentComplaintSocialData: any;
  currentComplaintComments: AngularFirestoreCollection<IComplaintComment>;
  currentComplaintLikes: AngularFirestoreCollection<IComplaintLike>;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private complaintsProvider: FirestoreProvider
  ) {

  }

  ionViewDidLoad() {
    this.mp = <any>this.complaintsProvider.GetMPs();
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
    
        var modalPage = this.modalCtrl.create(
          'MPComplaintListModalPage',
          {
            mp:mp
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
