import { Injectable } from '@angular/core';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { IComplaint, IComplaintComment, IComplaintLike, IComplaintCategory,IMPComplaint, IMP } from '../../interface/complaint.interface';
import { IUser } from '../../interface/common.interface';
import { ComplaintType } from '../../app/enums';
import { AngularFireStorage } from '@angular/fire/storage';

/*
  Generated class for the ComplaintsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreProvider {
  mpCollection: string ='mp';
  mpComplaintCollection: string ='mpComplaints';
  complaintsCollection: string = 'complaints';
  complaintImagesFolder: string = 'complaintImages/';
  complaintCategoryCollection: string = 'complaintCategory';
  mpCategoryCollection: string = 'mpComplaintCategory';
  complaintSocialDataCollection: string = 'complaintSocialData';
  complaintCommentsCollection: string = 'comments';
  complaintLikesCollection: string = 'likes';

  userCollection: string = 'users';

  geo: geofirex.GeoFireClient;

  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage) {
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

  AddNewMPComplaint(complaint) {
    complaint.created = new Date();
    this.geo.collection(this.mpComplaintCollection).add(complaint);
  };

  async AddNewComplaint(complaint, lat, lng, images?) {
    var counter = 0;
    var imagesUploaded = [];

    if(images && images.length > 0){
      for (let img of images) {
        var uniqueName = new Date().getTime().toString();
        await this.afStorage.ref(this.complaintImagesFolder + uniqueName).putString(img, 'data_url').then(snapshot => {
          counter++;
          imagesUploaded.push(uniqueName)
          console.log(imagesUploaded)
          if (counter >= images.length) {
            complaint.images = imagesUploaded;
            this.AddComplaintData(complaint, lat, lng);
          }
        })
      }
    }
    else{
      this.AddComplaintData(complaint, lat, lng);
    }
  };

  AddComplaintData(complaint: IComplaint, lat: number, lng: number) {
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

  GetMPs(){
    return this.db.collection(this.mpCollection).snapshotChanges().pipe
      (map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IMP;
          data.id = a.payload.doc.id;
          // data.socialData = this.GetSocialData(data.id).valueChanges();
          return data;
          
        });
      }))
  }

  GetMPComplaints(mpId){
    return this.db.collection(this.mpComplaintCollection, ref => {
      return ref.where('mpId','==',mpId).orderBy('created','desc');
    }).snapshotChanges().pipe
      (map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IMPComplaint;
          data.id = a.payload.doc.id;
          this.GetSocialData(data.id).then((sData)=>{
            data.socialData = sData;
          })
          // data.socialData = this.GetSocialData(data.id).valueChanges();
          return data;
          
        });
      }))
  }

  GetSocialData(complaintId: string) {
    // return this.db.doc(this.complaintSocialDataCollection + '/' + complaintId);
    return this.db.doc(this.complaintSocialDataCollection + '/' + complaintId)
      .ref.get().then(function (doc) {
        if (doc.exists) {
          console.log(doc.data())
          return doc.data();
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  GetImages(images: string[]){
    return new Promise((resolve, reject) => {
      var imagesUrl = [];
      for (let img of images){
        this.afStorage.ref(this.complaintImagesFolder + img).getDownloadURL().toPromise().then((url)=>{
          imagesUrl.push(url)
        }).catch((error)=> {
          reject(error)
        });
      }
      resolve(imagesUrl)
    })
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
  GetComplaintCategories(type){
    var collection = type == ComplaintType.General? this.complaintCategoryCollection:this.mpCategoryCollection;
    return this.db.collection(collection).snapshotChanges().pipe
      (map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IComplaintCategory;
          const id = a.payload.doc.id;
          return { Id: id, Name: data.Name, Color: data.Color } as IComplaintCategory;

        });
      }))
  }

  GetComplaintCategoryById(categoryId: string,type){
    var collection = type == ComplaintType.General? this.complaintCategoryCollection:this.mpCategoryCollection;
    return this.db.doc(collection + '/' + categoryId)
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
