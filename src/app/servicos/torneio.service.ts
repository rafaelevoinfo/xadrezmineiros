import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { Swiss, EventManager } from 'tournament-organizer';
import { LichessApiService } from './lichess-api.service';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  torneioManager;

  constructor(private firestore: AngularFirestore,
    private chessApi: LichessApiService) {
    this.torneioManager = new EventManager();
  }

  async buscarTorneios(ipSomenteAtivos: boolean): Promise<Torneio[]> {
    try {

      let vaResult: Torneio[] = [];
      let vaTorneiosRef = this.firestore.collection('torneios').ref;
      let vaSnapshot = undefined;
      if (ipSomenteAtivos) {
        vaSnapshot = await vaTorneiosRef.where("status", '!=', 2).get()
      } else {
        vaSnapshot = await vaTorneiosRef.get();
      }

      if (vaSnapshot.empty) {
        console.log('Nenhum torneio encontrado!');
        return;
      }

      vaSnapshot.forEach(data => {
        let vaTorneio = this.castDocumentDataToTorneio(data);
        if (vaTorneio) {
          vaResult.push(vaTorneio);
        }
      });

      vaResult = vaResult.sort((t1, t2) => {
        return t1.data_inicio.getTime() - t2.data_inicio.getTime()
      })

      return vaResult;

    } catch (error) {
      return [];
    }
  }

  async buscarTorneio(ipId: string): Promise<Torneio> {
    let vaDoc = await this.firestore.collection('torneios').ref.doc(ipId);
    if (vaDoc) {
      let vaData = await vaDoc.get();
      return this.castDocumentDataToTorneio(vaData);
    } else {
      return null;
    }
  }

  criarTorneioSuico(ipTorneio: Torneio): Swiss {
    const vaTorneioSwiss = this.torneioManager.createTournament(null, {
      name: ipTorneio.nome,
      format: 'swiss',
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

  async iniciarTorneio(ipTorneio: Torneio): Promise<boolean> {
    ipTorneio.status = 1;
    this.processarRodada(ipTorneio);

    return await this.atualizarTorneio(ipTorneio);
  }

  processarRodada(ipTorneio: Torneio): Boolean {
    let vaResult = false;
    let vaTorneioSwiss = this.criarTorneioSuico(ipTorneio);

    //vamos pegar a proxima rodada se disponivel
    if ((vaTorneioSwiss.currentRound >= 0) && vaTorneioSwiss.active) {
      //se true, indica que uma nova rodada começou
      if (ipTorneio.rodada_atual < vaTorneioSwiss.currentRound) {
        let vaMatches = vaTorneioSwiss.activeMatches(vaTorneioSwiss.currentRound);

        if ((vaMatches) && (vaMatches.length > 0)) {
          let vaRodada = new Rodada();
          vaRodada.data_inicio = new Date();
          vaRodada.numero = vaMatches[0].round;//sera sempre o mesmo valor
          ipTorneio.rodada_atual = vaRodada.numero;
          for (const vaMatch of vaMatches) {
            let vaPartida = new Partida();
            vaPartida.jogadorBrancas = new Jogador();
            vaPartida.jogadorBrancas.nome = vaMatch.playerOne.alias;
            vaPartida.jogadorBrancas.username = vaMatch.playerOne.id;

            vaPartida.jogadorNegras = new Jogador();
            vaPartida.jogadorNegras.nome = vaMatch.playerTwo.alias;
            vaPartida.jogadorNegras.username = vaMatch.playerTwo.id;

            vaRodada.partidas.push(vaPartida);
          }

          ipTorneio.rodadas.push(vaRodada);
          vaResult = true;
        }
      }
    } else {
      ipTorneio.status = 2;
      vaResult = true;
    }
    return vaResult;
  }

  ranking(ipTorneio: Torneio) {
    let vaJogadores: Jogador[] = [];
    let vaTorneioSwiss = this.criarTorneioSuico(ipTorneio);
    //pega o ranking
    let vaPlayers = vaTorneioSwiss.standings(true);
    if (vaPlayers) {
      for (const vaPlayer of vaPlayers) {
        let vaJogador: Jogador = new Jogador();
        vaJogador.nome = vaPlayer.alias;
        vaJogador.username = vaPlayer.id;
        vaJogadores.push(vaJogador);
      }
    }

    return vaJogadores;
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

  async incluirTorneio(ipTorneio: Torneio): Promise<string> {
    //nao se pode passar objetos customizados (criados com uso do new). Tem sempre que ser um Object
    let vaDocument = await this.firestore.collection('torneios').ref.add(this.createObject(ipTorneio));
    if (vaDocument) {
      ipTorneio.id = vaDocument.id;
    }
    return vaDocument.id;
  }

  async atualizarTorneio(ipTorneio: Torneio): Promise<boolean> {
    let vaDocument = this.firestore.collection('torneios').ref.doc(ipTorneio.id);
    if (vaDocument) {
      await vaDocument.update(this.createObject(ipTorneio));
      return true;
    }
  }

  async excluirTorneio(ipId: string): Promise<boolean> {
    let vaDocument = this.firestore.collection('torneios').ref.doc(ipId);
    if (vaDocument) {
      await vaDocument.delete();
      return true;
    } else {
      return false;
    }
  }

  private createObject(ipTorneio: Torneio) {
    let vaObj = Object.assign({}, ipTorneio);
    vaObj.jogadores = [];
    vaObj.rodadas = [];
    ipTorneio.jogadores.forEach(j => {
      vaObj.jogadores.push(Object.assign({}, j));
    });


    ipTorneio.rodadas.forEach(r => {
      let vaRodada = Object.assign({}, r);
      vaRodada.partidas = [];
      for (const vaPartida of r.partidas) {
        let vaJb = Object.assign({}, vaPartida.jogadorBrancas);
        let vaJn = Object.assign({}, vaPartida.jogadorNegras);

        let vaP = Object.assign({}, vaPartida);
        vaP.jogadorBrancas = vaJb;
        vaP.jogadorNegras = vaJn;

        vaRodada.partidas.push(vaP);
      }
      vaObj.rodadas.push(vaRodada);
    });

    return vaObj;
  }

  castDocumentDataToTorneio(ipDocData: DocumentData): Torneio {
    if (ipDocData) {
      let vaData = ipDocData.data();
      let vaTorneio: Torneio = Object.assign(new Torneio, vaData);
      vaTorneio.id = ipDocData.id;
      vaTorneio.data_inicio = new Date(vaData.data_inicio.seconds * 1000);
      for (const vaRodada of vaTorneio.rodadas) {
        let vaDataSec: any = vaRodada.data_inicio;
        vaRodada.data_inicio = new Date(vaDataSec.seconds * 1000);
      }
      return vaTorneio;
    }
  }
}
