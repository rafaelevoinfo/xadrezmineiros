import { Component, OnInit, ViewChild } from '@angular/core';
import { IonCheckbox, NavController } from '@ionic/angular';
import { Torneio } from '../Models/types';
import { TorneioService } from '../servicos/torneio.service';

@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.page.html',
  styleUrls: ['./torneios.page.scss'],
})
export class TorneiosPage implements OnInit {

  @ViewChild(IonCheckbox) chkTorneioFinalizados: IonCheckbox;

  private torneios: Torneio[];
  constructor(private torneioService: TorneioService,
    private navCtrl: NavController) {

  }

  ngOnInit() {

  }
  async ngAfterViewInit() {

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

}
