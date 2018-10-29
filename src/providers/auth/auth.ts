import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { FirestoreProvider } from '../firestore/firestore';
import { IUser } from '../../interface/common.interface';
import { auth } from 'firebase/app';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Events } from 'ionic-angular';



/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  user: Observable<IUser>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestoreProvider: FirestoreProvider,
    private events: Events
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.firestoreProvider.GetUserDoc(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.events.subscribe('auth_signout', this.signOut);
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider).then((credentials) => {
      this.updateUserData(credentials.user);
      this.events.publish('auth_login_completed');
    }).catch(error => {
      console.error(error);
    });
  }

  private updateUserData(user){
    const userRef: AngularFirestoreDocument<any> = this.firestoreProvider.GetUserDoc(user.uid); 

    const data: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data, {merge: true});
  }

  signOut(){
    this.afAuth.auth.signOut().then(() => {
      this.events.publish('auth_signout_completed');
    })
  }
}
