import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { Torneio } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {

  constructor(private firestore: AngularFirestore) {

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

  private createObject(ipTorneio: Torneio) {
    let vaObj = Object.assign({}, ipTorneio);
    vaObj.jogadores = [];
    ipTorneio.jogadores.forEach(j => {
      vaObj.jogadores.push(Object.assign({}, j));
    });

    return vaObj;
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

  castDocumentDataToTorneio(ipDocData: DocumentData): Torneio {
    if (ipDocData) {
      let vaTorneio = Object.assign(new Torneio, ipDocData.data());
      vaTorneio.id = ipDocData.id;
      return vaTorneio;
    }
  }
}
