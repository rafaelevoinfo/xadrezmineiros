import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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

  constructor(
    public authService: AuthService,
    private torneioService: TorneioService,
    private navCtrl: NavController) {

  }


  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  ionViewDidEnter() {
    this.buscarTorneios();
  }

  async buscarTorneios() {
    this.torneios = await this.torneioService.buscarTorneios(!this.chkTorneioFinalizados.checked);
  }

  abrirTorneio(ipTorneio: Torneio) {
    this.navCtrl.navigateForward(`/torneio/${ipTorneio.id}`);
  }

  criarTorneio() {
    this.navCtrl.navigateForward('/torneio');
  }

}
