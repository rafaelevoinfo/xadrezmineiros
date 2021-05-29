import { Component, ContentChild, ContentChildren, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
// import {Router} from '@angular/core/r';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  @ViewChild('header',  { read: ElementRef }) header:ElementRef;

  constructor(private auth: AngularFireAuth, private router:Router) {
    this.auth.signInWithEmailAndPassword("anonimo@gmail.com", '123456');
  }

  ngAfterViewInit() {
    
    
  }

  onScrolling(event){    
      if (this.header){
        let vaAlpha = Math.min(1, event.detail.scrollTop / 100);
        this.header.nativeElement.style = `background: rgba(39, 38, 38, ${vaAlpha});`              
      }    
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
