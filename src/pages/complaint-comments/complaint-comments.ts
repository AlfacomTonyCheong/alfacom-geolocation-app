import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { IComplaintComment, IComplaint, IComplaintLike } from '../../interface/complaint.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ComplaintType, ComplaintLikeType } from '../../app/enums';
import { first } from 'rxjs/operators';

/**
 * Generated class for the ComplaintCommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaint-comments',
  templateUrl: 'complaint-comments.html',
})
export class ComplaintCommentsPage {
  commentId: string;
  comments$;
  newCommentText: string;
  likeBtnDisabled: boolean;
  currentComplaint: IComplaint;
  currentComplaintId: string;
  currentComplaintSocialData: any;
  currentComplaintImages: any[] = [];
  currentComplaintComments: AngularFirestoreCollection<IComplaintComment>;
  currentComplaintLikes: AngularFirestoreCollection<IComplaintLike>;
  imgRoot: string = "assets/imgs/complaints/"

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private complaintsProvider: FirestoreProvider) {
    this.currentComplaint = this.navParams.get('complaint');
    this.currentComplaintSocialData = this.navParams.get('complaintSocialData');
    this.currentComplaintId = this.navParams.get('commentId');
    this.comments$ = this.navParams.get('comments').valueChanges();
    this.imgRoot = this.navParams.get('type') == ComplaintType.General? "assets/imgs/complaints/": "assets/imgs/mpComplaints/"
  }

  ionViewDidLoad() {
    
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  getImgSrc(name: string) {
    if (name) {
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  submitNewComment(){
    var newComment: IComplaintComment = {
      content: this.newCommentText,
      createdBy: 'System'
    }
    this.complaintsProvider.AddNewComment(this.currentComplaintId, newComment);
    this.newCommentText = '';
    setTimeout(() => { this.getComplaintSocialData(); }, 2000);
    this.getComplaintSocialData()
  }

  getComplaintSocialData() {
    // this.currentComplaintSocialData = this.complaintsProvider.GetSocialData(this.currentComplaintId);
    this.complaintsProvider.GetSocialData(this.currentComplaintId).then((data)=>{
      this.currentComplaintSocialData = data;
    });
    //this.currentComplaintLikes = this.complaintsProvider.GetLikes(this.currentComplaintId);
  }

  onLikeBtnClick() {
    this.likeBtnDisabled = true;
    this.complaintsProvider.GetIfLikeExistsByUser(this.currentComplaintId, 'System').pipe(first()).subscribe((exists) => {
      console.log('like exists: ' + exists);
      if (exists[0] == true) {
        console.log('delete like');
        this.complaintsProvider.DeleteLike(this.currentComplaintId, 'System');
      }
      else {
        console.log('add like');
        var like: IComplaintLike = {
          type: ComplaintLikeType.Like,
          createdBy: 'System'
        }
        this.complaintsProvider.AddNewLike(this.currentComplaintId, like);
      }
    })
    setTimeout(() => { this.getComplaintSocialData();this.likeBtnDisabled = false }, 3000);
  }
}
