import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Torneio } from '../Models/types';
import { TorneioService } from '../servicos/torneio.service';

@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.page.html',
  styleUrls: ['./torneios.page.scss'],
})
export class TorneiosPage implements OnInit {

  private torneios: Torneio[];
  constructor(private torneioService: TorneioService,
    private navCtrl: NavController) {

  }

  ngOnInit() {

  }
  async ngAfterViewInit() {
    this.torneios = await this.torneioService.buscarTorneios(true);
  }

  abrirTorneio(ipTorneio: Torneio) {
    this.navCtrl.navigateForward(`/torneio/${ipTorneio.id}`);
  }

}
