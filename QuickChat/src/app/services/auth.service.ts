import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";


@Injectable()
export class AuthService {

  public isSignedInStream: Observable<boolean>;
  public displayNameStream: Observable<string>;
  public photoUrl: string;
  public userID: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe( (user: firebase.User) =>{
      if(user){
          console.log(user, "has signed in");
          this.photoUrl = user.photoURL;
          this.userID = user.uid;
      } else {
          console.log("Failed to sign in");
          this.photoUrl = "";
          this.userID = "";
      }
   });
   this.isSignedInStream = this.afAuth.authState.map<firebase.User, boolean>
   ((user: firebase.User) => { 
     return user != null;
    });
    this.displayNameStream = this.afAuth.authState.map<firebase.User, string>
    ((user: firebase.User) => { 
     if(user){
       return user.displayName;
     } else{
       return "";
     }
    });
    
  }

  signOut(): void{
    this.afAuth.auth.signOut();
    this.router.navigate(['/signin']);
  }

  signInWithGoogle(): void{
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((user : firebase.User)=>{
      this.router.navigate(['/']);
  });
  }

}
