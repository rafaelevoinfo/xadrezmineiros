import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {Storage} from '@capacitor/storage'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLogado: boolean;
  private _user: firebase.User;

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user =>{
      this._isLogado = user && (user.uid != '');
      console.log(user);
    });      
  }  

  get user() {
    return this._user;
  }

  get isLogado(): boolean {
    return !this._isLogado ? false : this._isLogado;
  }

}
