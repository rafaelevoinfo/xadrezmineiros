import { Component, ContentChild, ContentChildren, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import {Router} from '@angular/core/r';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('header', { read: ElementRef }) header: ElementRef;

  indexChecked: number = -1;
  pages = ['home', 'torneios', 'login'];

  constructor(private auth: AngularFireAuth, private router: Router, private activeRouter: ActivatedRoute) {
    this.auth.signInWithEmailAndPassword("anonimo@gmail.com", '123456');
  }

  ngOnInit() {    
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let vaPath = e.url.replace('/','');
        this.updateCheckedIndex(vaPath);
      }
    })
  }

  ionViewDidEnter() {
    //Esse evento nao dispara aqui. Acredito que seja por conta deste ser a primeira pagina, mas nao sei ao certo.      
  }

  updateCheckedIndex(ipPath: string) {
    let vaIndex = this.pages.indexOf(ipPath);
    if (vaIndex > 0)
      this.indexChecked = vaIndex
    else
      this.indexChecked = 0;
  }

  onScrolling(event) {
    if (this.header) {
      let vaAlpha = Math.min(1, event.detail.scrollTop / 100);
      this.header.nativeElement.style = `background: rgba(39, 38, 38, ${vaAlpha});`
    }
  }

  radioChanged(event) {    
    if ((event) && (event.target)) {
      let vaLink = event.target.getAttribute('data-link');
      if (vaLink) {
        this.updateCheckedIndex(vaLink);
        this.router.navigateByUrl(vaLink);
      }
    }

  }


  login() {

  }
}
