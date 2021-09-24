import { Injectable } from '@angular/core';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { LichessApiService } from './lichess-api.service';
import { XadrezMineirosApi } from './xadrezmineiros-api.service';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  torneioManager;

  constructor(private chessApi: LichessApiService) {
  }

  async buscarJogador(ipUsername: string): Promise<Jogador> {    
    let vaResult = await this.chessApi.buscarUsuario(ipUsername);
    if (vaResult) {
      let vaJogador = new Jogador();
      vaJogador.nome = vaResult?.profile?.firstName;
      vaJogador.rating = vaResult.perfs?.rapid?.rating;
      vaJogador.username = ipUsername;

      if (!vaJogador.nome) {
        vaJogador.nome = vaJogador.username
      }
      if (!vaJogador.rating) {
        vaJogador.rating = 1500;
      }

      return vaJogador;
    }
  }

  async buscarResultados(ipTorneio: Torneio): Promise<boolean> {
    let vaResult = false;
    let vaRodada = ipTorneio.rodadas[ipTorneio.rodada_atual - 1];
    if (vaRodada) {
      for (const vaPartida of vaRodada.partidas) {
        if (await this.pegarResultado(ipTorneio, vaRodada, vaPartida)) {
          vaResult = true;
        }
      }
    }

    return vaResult;
  }

  async pegarResultado(ipTorneio: Torneio, ipRodada: Rodada, ipPartida: Partida): Promise<boolean> {
    let vaResultados = await this.chessApi.pegarResultadoJogos(ipPartida.jogadorBrancas.username, {
      vs: ipPartida.jogadorNegras.username,
      max: 1,
      rated: true,
      since: ipRodada.data_inicio.getTime(),
      ritmo: ipTorneio.ritmo,
      color: 'white'
    });

    if (vaResultados && (vaResultados.length > 0)) {
      ipPartida.resultado = vaResultados[0].resultado;
      ipPartida.link = vaResultados[0].link_partida;
      return true;
    }

    return false;
  }

  

  

  
}
