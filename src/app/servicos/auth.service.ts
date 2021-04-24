import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLogado: boolean;
  private _user: firebase.User;

  constructor(private auth: AngularFireAuth) {
    this.auth.user.subscribe({
      next: (user) => {
        this._user = user;
        this._isLogado = user?.email != 'anonimo@gmail.com';
      }
    });
  }

  get user() {
    return this._user;
  }

  get isLogado(): boolean {
    return this._isLogado;
  }
}
