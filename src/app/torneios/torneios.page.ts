import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonCheckbox, IonInput, NavController } from '@ionic/angular';
import { Timestamp } from 'rxjs';
import { Torneio } from '../Models/types';
import { XadrezMineirosApi } from '../servicos/xadrezmineiros-api.service';

@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.page.html',
  styleUrls: ['./torneios.page.scss'],
})
export class TorneiosPage implements OnInit {
  @ViewChild(IonCheckbox) chkTorneioFinalizados: IonCheckbox;
  @ViewChild(IonInput) editNome: IonInput;

  public torneios: Torneio[];
  data: Date;
  delayPesquisa;

  constructor(public serverApi: XadrezMineirosApi, private router: Router) {
    this.data = new Date();
  }

  ngOnInit() {
    //console.log(this.router.url);
  }
  ngAfterViewInit() {}

  ionViewDidEnter() {
    this.buscarTorneios();
  }

  async buscarTorneios() {
    // console.log(event?.target.value);    
    if (this.delayPesquisa) {
      clearTimeout(this.delayPesquisa);
    }

    this.delayPesquisa = setTimeout(async () => {
      this.pesquisar()
    }, 500);
  }

  async pesquisar(){
    let vaTorneios = await this.serverApi.buscarTorneios({
      somente_ativos: !this.chkTorneioFinalizados.checked,
      nome: String(this.editNome.value)
    });

    if (Array.isArray(vaTorneios)) {
      this.torneios = vaTorneios;
    }else{
      this.torneios = [];
    }
  }

  abrirTorneio(ipTorneio: Torneio) {
    //this.navCtrl.navigateForward(`/torneio/${ipTorneio.id}`);
    this.router.navigateByUrl(`/torneio/${ipTorneio.id}`);
  }

  criarTorneio() {
    this.router.navigateByUrl('/torneio');
  }
}
