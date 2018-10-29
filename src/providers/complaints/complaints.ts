import { Injectable } from '@angular/core';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { IComplaint, IComplaintComment, IComplaintLike, IComplaintCategory } from '../../interface/complaint.interface';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

/*
  Generated class for the ComplaintsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ComplaintsProvider {

  collection: string ='complaints';
  
  complaintImagesFolder: string = 'complaintImages/';
  categoryCollection: string = 'complaintCategory';
  socialDataCollection: string = 'complaintSocialData';
  commentsCollection: string = 'comments';
  likesCollection: string = 'likes';

  geo: geofirex.GeoFireClient;

  constructor(private db: AngularFirestore,private afStorage: AngularFireStorage) {
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

  async AddNewComplaint(complaint,lat,lng,images) {
    var counter = 0;
    var imagesUploaded = [];
      for(let img of images) {
        var uniqueName = new Date().getTime().toString();
        await this.afStorage.ref(this.complaintImagesFolder+uniqueName).putString(img, 'data_url').then(snapshot => {
            counter ++;
            imagesUploaded.push(uniqueName)
            console.log(imagesUploaded)
            if (counter >= images.length){
              complaint.images = imagesUploaded;
              this.AddComplaintData(complaint,lat,lng)
            }
        })
      }
    };
 

  AddComplaintData(complaint: IComplaint, lat: number, lng: number){
    const point = this.geo.point(lat, lng);
    complaint.position = point.data;
    complaint.created = new Date();
    this.geo.collection(this.collection).add(complaint).then((res)=>{
      console.log('Complaint added successfully')
    }).catch(error => {
      console.log('Error adding complaint: ' + error);
    });
    
    
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

  GetImages(images: string[]){
    var imagesUrl = [];
    for (let img of images){
      this.afStorage.ref(this.complaintImagesFolder+img).getDownloadURL().toPromise().then((url)=>{
        imagesUrl.push(url)
      }).catch((error)=> {
        switch (error.code) {
          case 'storage/object-not-found':
            console.log("Error! Image: " + img + " doesn't exist")
      
          case 'storage/unauthorized':
          console.log("Error! User doesn't have permission to access " + img);

          case 'storage/unknown':
          console.log("Error");
        }
      });
    }
    return imagesUrl;
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

  //Complaint Categories
  GetComplaintCategories(){
    return this.db.collection(this.categoryCollection).snapshotChanges().pipe
      (map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IComplaintCategory;
          const id = a.payload.doc.id;
          return {Id: id,Name:data.Name,Color:data.Color} as IComplaintCategory;
          
        });
      }))
  }
  
  GetComplaintCategoryById(categoryId: string){
    return this.db.doc(this.categoryCollection + '/' + categoryId)
    .ref.get().then(function(doc) {
      if (doc.exists) {
          return doc.data().Name;
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
}
