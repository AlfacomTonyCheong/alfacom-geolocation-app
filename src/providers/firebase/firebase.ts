import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class FirebaseProvider {

  constructor(private db: AngularFirestore) {

  }

  getDocRef(docPath: string){
    return this.db.doc(docPath);
  }

  getCollectionRef(collectionPath: string) {
    return this.db.collection(collectionPath);
  }
}
