import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
// import {Router} from '@angular/core/r';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AngularFireAuth, private router:Router) {
    this.auth.signInWithEmailAndPassword("anonimo@gmail.com", '123456');
  }

  login() {

  }

  radioChanged(event){
    if ((event) && (event.target)){
      let vaLink = event.target.getAttribute('data-link');
      if (vaLink){
        this.router.navigateByUrl(vaLink);
      }
    }
    
  }
}
