import { Component } from '@angular/core';
import { firebase } from '@firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AngularFireAuth) {
    this.auth.signInWithEmailAndPassword('rafaelevoinfo@gmail.com', 'xadrez04');
  }
}
