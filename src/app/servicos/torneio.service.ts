import { Injectable } from '@angular/core';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { Swiss, EventManager } from 'tournament-organizer';
import { LichessApiService } from './lichess-api.service';
import { XadrezMineirosApi } from './xadrezmineiros-api.service';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  torneioManager;

  constructor(private serverApi:XadrezMineirosApi,
    private chessApi: LichessApiService) {
    this.torneioManager = new EventManager();
  }


  criarTorneioSuico(ipTorneio: Torneio): Swiss {
    const vaTorneioSwiss = this.torneioManager.createTournament(null, {
      name: ipTorneio.nome,
      format: 'swiss',
      dutch: true,
      seedOrder: "des",
      seededPlayers: true,
      numberOfRounds: ipTorneio.qtde_rodadas,
    });

    for (const vaJogador of ipTorneio.jogadores) {
      vaTorneioSwiss.addPlayer(vaJogador.nome, vaJogador.username, vaJogador.rating);
    }

    vaTorneioSwiss.startEvent();

    //vamos alimentar o vaTorneioSwiss com as informações que ja temos
    if ((ipTorneio.rodadas) && (ipTorneio.rodadas.length > 0)) {
      for (let i = 0; i < ipTorneio.rodadas.length; i++) {
        let vaRodada = ipTorneio.rodadas[i];
        let vaMatches = vaTorneioSwiss.activeMatches(i + 1);
        for (const vaMatch of vaMatches) {
          let vaPartida = vaRodada.partidas.find((p) => {
            return (p.jogadorBrancas.username == vaMatch.playerOne.id) && (p.jogadorNegras.username == vaMatch.playerTwo.id)
          });

          if ((vaPartida) && (vaPartida.resultado)) {
            let vaPlayerOneWins = vaPartida.resultado == '1-0' ? 1 : 0;
            let vaPlayerTwoWins = vaPartida.resultado == '0-1' ? 1 : 0;

            vaTorneioSwiss.result(vaMatch, vaPlayerOneWins, vaPlayerTwoWins);
          }
        }
      }
    }

    return vaTorneioSwiss;
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
