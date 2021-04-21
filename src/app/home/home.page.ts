import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  abrirFace() {
    window.location.href = "https://www.facebook.com/XadrezMineiros-101407585326095";
  }

  abrirInstagram() {
    window.location.href = "https://www.instagram.com/xadrezmineiros/";
  }

}
