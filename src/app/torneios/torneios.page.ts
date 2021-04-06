import { Component, OnInit } from '@angular/core';
import { Torneio } from '../Models/types';
import { TorneioService } from '../servicos/torneio.service';

@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.page.html',
  styleUrls: ['./torneios.page.scss'],
})
export class TorneiosPage implements OnInit {

  private torneios: Torneio[];
  constructor(private torneioService: TorneioService) {

  }

  ngOnInit() {
    this.torneioService.buscarTorneios(true).then(t => {
      this.torneios = t;
    }).catch(error => console.log('Erro ao buscar os torneios'));
  }

}
