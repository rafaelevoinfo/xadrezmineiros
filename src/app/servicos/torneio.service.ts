import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import * as TournamentOrganizer from 'tournament-organizer';
//import { TournamentOrganizer } from "../../../node_modules/tournament-organizer";

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  torneioManager;

  constructor(private firestore: AngularFirestore) {
    this.torneioManager = new TournamentOrganizer.EventManager();
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

  async iniciarTorneio(ipTorneio: Torneio): Promise<boolean> {
    ipTorneio.status = 1;
    ipTorneio.data_inicio = new Date();
    const vaTorneioSwiss = this.torneioManager.createTournament(null, {
      name: ipTorneio.nome,
      format: 'swiss'
    });

    for (const vaJogador of ipTorneio.jogadores) {
      vaTorneioSwiss.addPlayer(vaJogador.nome, vaJogador.username);
    }

    vaTorneioSwiss.startEvent();

    let vaMatches = vaTorneioSwiss.activeMatches();
    if ((vaMatches) && (vaMatches.length > 0)) {
      ipTorneio.rodada_atual = 1;
      let vaRodada = new Rodada();
      vaRodada.data_inicio = new Date();
      vaRodada.numero = vaMatches[0].round;//sera sempre o mesmo valor
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
    }

    return this.atualizarTorneio(ipTorneio);



    /*console.log(active);

    tourney.result(active[0], 1, 0);
    tourney.result(active[1], 0, 1);

    active = tourney.activeMatches();
    console.log(active);

    tourney.result(active[0], 1, 0);
    tourney.result(active[1], 0, 1);

    console.log(tourney.standings());*/

  }

  async criarTorneio(ipTorneio: Torneio): Promise<string> {
    //nao se pode passar objetos customizados (criados com uso do new). Tem sempre que ser um Object
    let vaDocument = await this.firestore.collection('torneios').ref.add(this.createObject(ipTorneio));
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

    console.log('Objecto', vaObj);

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
