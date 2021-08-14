import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { IonCheckbox, NavController } from '@ionic/angular';
import { Torneio } from '../Models/types';
import { AuthService } from '../servicos/auth.service';
import { TorneioService } from '../servicos/torneio.service';

@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.page.html',
  styleUrls: ['./torneios.page.scss'],
})
export class TorneiosPage implements OnInit {

  @ViewChild(IonCheckbox) chkTorneioFinalizados: IonCheckbox;

  public torneios: Torneio[];
  data:Date;


  // current: number = 2;
  // max: number = 6;
  // stroke: number = 15;
  // radius: number = 125;
  // semicircle: boolean = false;
  // rounded: boolean = true;
  // responsive: boolean = true;
  // clockwise: boolean = true;
  // color: string = '#45ccce';
  // background: string = '#eaeaea';
  // duration: number = 800;
  // animation: string = 'easeOutCubic';
  // animationDelay: number = 1;
  // animations: string[] = [];
  // gradient: boolean = false;
  // realCurrent: number = 0;
  // rate:number;


  constructor(
    public authService: AuthService,
    private torneioService: TorneioService,  
    private router:Router) {
this.data = new Date();
  }


  ngOnInit() {
    //console.log(this.router.url);
  }
  ngAfterViewInit() {

  }

  ionViewDidEnter() {
    this.buscarTorneios();
  }

  async buscarTorneios() {
    this.torneios = await this.torneioService.buscarTorneios(false);
  }

  abrirTorneio(ipTorneio: Torneio) {
    console.log(ipTorneio.id)
    //this.navCtrl.navigateForward(`/torneio/${ipTorneio.id}`);
    this.router.navigateByUrl(`/torneio/${ipTorneio.id}`);
  }

  criarTorneio() {
    this.router.navigateByUrl('/torneio');
  }

}
