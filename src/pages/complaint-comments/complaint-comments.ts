import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { IComplaintComment } from '../../interface/complaint.interface';

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

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private complaintsProvider: FirestoreProvider) {
    this.commentId = this.navParams.get('commentId');
    this.comments$ = this.navParams.get('comments').valueChanges();
  }

  ionViewDidLoad() {
    
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  submitNewComment(){
    var newComment: IComplaintComment = {
      content: this.newCommentText,
      createdBy: 'System'
    }
    this.complaintsProvider.AddNewComment(this.commentId, newComment);
    this.newCommentText = '';
  }
}
