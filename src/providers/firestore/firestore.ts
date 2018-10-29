import { Injectable } from '@angular/core';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { IComplaint, IComplaintComment, IComplaintLike, IComplaintCategory } from '../../interface/complaint.interface';
import { IUser } from '../../interface/common.interface';

/*
  Generated class for the ComplaintsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreProvider {

  complaintsCollection: string = 'complaints';
  complaintCategoryCollection: string = 'complaintCategory';
  complaintSocialDataCollection: string = 'complaintSocialData';
  complaintCommentsCollection: string = 'comments';
  complaintLikesCollection: string = 'likes';

  userCollection: string = 'users';

  geo: geofirex.GeoFireClient;

  constructor(private db: AngularFirestore) {
    this.geo = geofirex.init(firebaseApp);
  }

  GeoFireX_GetInRadiusObs(lat: number, lng: number, radius: number): Observable<geofirex.GeoQueryDocument[]> {
    const collection = this.geo.collection(this.complaintsCollection);
    var center = this.geo.point(lat, lng); // the centerpoint of the query
    var radius = radius; // the search radius in kilometers
    var field = 'position'; // the document field with the geopoint object, required because docs can have multiple points

    return collection.within(center, radius, field);
  }

  GeoFireX_SetPoint(id: string, lat: number, lng: number) {
    const collection = this.geo.collection(this.complaintsCollection);
    collection.setPoint(id, 'geopoint', lat, lng);
  }

  AddNewPoint(lat: number, lng: number) {
    const point = this.geo.point(lat, lng);
    this.geo.collection(this.complaintsCollection).add({ position: point.data }); // geo.point.data generates { geohash: string, geopoint: GeoPoint } object
  }

  AddNewComplaint(complaint: IComplaint, lat: number, lng: number) {
    const point = this.geo.point(lat, lng);
    complaint.position = point.data;
    complaint.created = new Date();
    this.geo.collection(this.complaintsCollection).add(complaint);
  }

  AddNewComment(complaintId: string, comment: IComplaintComment) {
    comment.created = new Date();
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintComment>(this.complaintCommentsCollection).add(comment);
  }

  AddNewLike(complaintId: string, like: IComplaintLike) {
    like.created = new Date();
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintLike>(this.complaintLikesCollection).add(like);
  }

  DeleteLike(complaintId: string, author: string) {
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintLike>(this.complaintLikesCollection, ref => ref.where('createdBy', '==', author).limit(1)).snapshotChanges().pipe(
      first(),
      map(docs => docs.map(doc => {
        const data = doc.payload.doc.data() as IComplaintLike;
        const id = doc.payload.doc.id;
        this.db.doc(this.complaintSocialDataCollection + '/' + complaintId + '/' + this.complaintLikesCollection + '/' + id).delete().then(() => {
          console.log('Deleting like by ' + author + ' for complaint: ' + complaintId);
        }).catch(error => {
          console.error('Error deleting like: ' + error);
        });
      }))
    ).subscribe();
  }

  GetSocialData(complaintId: string) {
    return this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
  }

  GetComments(complaintId: string) {
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintComment>(this.complaintCommentsCollection, ref => {
      return ref.orderBy('created', 'desc');
    });
  }

  GetLikes(complaintId: string) {
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintLike>(this.complaintLikesCollection);
  }

  GetIfLikeExistsByUser(complaintId: string, createdBy: string) {
    var socialDataDoc = this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintLike>(this.complaintLikesCollection, ref => ref.where('createdBy', '==', createdBy).limit(1)).snapshotChanges().pipe(
      map(docs => docs.map(doc => {
        return doc.payload.doc.exists;
      }))
    );
  }

  GetUserDoc(userId: string) {
    return this.db.doc<IUser>(this.userCollection + '/' + userId);
  }

  GenerateNewId() {
    return this.db.collection(this.complaintsCollection).ref.doc().id;
  }

  //Complaint Categories
  GetComplaintCategories() {
    return this.db.collection(this.complaintCategoryCollection).snapshotChanges().pipe
      (map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IComplaintCategory;
          const id = a.payload.doc.id;
          return { Id: id, Name: data.Name, Color: data.Color } as IComplaintCategory;

        });
      }))
  }

  GetComplaintCategoryById(categoryId: string) {
    return this.db.doc(this.complaintCategoryCollection + '/' + categoryId)
      .ref.get().then(function (doc) {
        if (doc.exists) {
          return doc.data().Name;
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    // return this.db.doc(this.categoryCollection + '/' + categoryId).snapshotChanges().pipe
    //   (map(docs => docs.map(doc => {
    //     return doc.payload.doc.exists;
    //   })))
  }
}
