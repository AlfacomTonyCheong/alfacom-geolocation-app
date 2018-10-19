import { Injectable } from '@angular/core';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IComplaint, IComplaintComment, IComplaintLike } from '../../interface/complaint.interface';
import { map, first } from 'rxjs/operators';

/*
  Generated class for the ComplaintsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ComplaintsProvider {

  collection: string ='complaints';
  
  socialDataCollection: string = 'complaintSocialData';
  commentsCollection: string = 'comments';
  likesCollection: string = 'likes';

  geo: geofirex.GeoFireClient;

  constructor(private db: AngularFirestore) {
    this.geo = geofirex.init(firebaseApp);
  }

  GeoFireX_GetInRadiusObs(lat: number, lng: number, radius: number) : Observable<geofirex.GeoQueryDocument[]>{
    const collection = this.geo.collection(this.collection);
    var center = this.geo.point(lat, lng); // the centerpoint of the query
    var radius = radius; // the search radius in kilometers
    var field = 'position'; // the document field with the geopoint object, required because docs can have multiple points

    return collection.within(center, radius, field);
  }

  GeoFireX_SetPoint(id: string, lat: number, lng: number){
    const collection = this.geo.collection(this.collection);
    collection.setPoint(id, 'geopoint', lat, lng);
  }

  AddNewPoint(lat: number, lng: number){
    const point = this.geo.point(lat, lng); 
    this.geo.collection(this.collection).add({position: point.data}); // geo.point.data generates { geohash: string, geopoint: GeoPoint } object
  }

  AddNewComplaint(complaint: IComplaint, lat: number, lng: number){
    const point = this.geo.point(lat, lng);
    complaint.position = point.data;
    complaint.created = new Date();
    this.geo.collection(this.collection).add(complaint);
  }

  AddNewComment(complaintId: string, comment: IComplaintComment){
    comment.created = new Date();
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintComment>(this.commentsCollection).add(comment);
  }

  AddNewLike(complaintId: string, like: IComplaintLike){
    like.created = new Date();
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintLike>(this.likesCollection).add(like);
  }

  DeleteLike(complaintId: string, author: string){
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    socialDataDoc.collection<IComplaintLike>(this.likesCollection, ref => ref.where('createdBy', '==', author).limit(1)).snapshotChanges().pipe(
      first(),
      map(docs => docs.map(doc => {
        const data = doc.payload.doc.data() as IComplaintLike;
        const id = doc.payload.doc.id;
        this.db.doc(this.socialDataCollection + '/' + complaintId + '/' + this.likesCollection + '/' + id).delete().then(()=>{
          console.log('Deleting like by ' + author + ' for complaint: ' + complaintId);
        }).catch(error => {
          console.error('Error deleting like: ' + error);
        });
      }))
    ).subscribe();
  }

  GetSocialData(complaintId: string){
    return this.db.doc(this.socialDataCollection + '/' + complaintId);
  }

  GetComments(complaintId: string){
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintComment>(this.commentsCollection, ref => {
      return ref.orderBy('created', 'desc');
    });
  }

  GetLikes(complaintId: string){
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintLike>(this.likesCollection);
  }

  GetIfLikeExistsByUser(complaintId: string, createdBy: string){
    var socialDataDoc = this.db.doc(this.socialDataCollection + '/' + complaintId);
    return socialDataDoc.collection<IComplaintLike>(this.likesCollection, ref => ref.where('createdBy', '==', createdBy).limit(1)).snapshotChanges().pipe(
      map(docs => docs.map(doc => {
        return doc.payload.doc.exists;
      }))
    );
  }

  GenerateNewId(){
    return this.db.collection(this.collection).ref.doc().id;
  }
}
