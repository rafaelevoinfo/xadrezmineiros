import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Torneio } from '../Models/types';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {

  constructor(private firestore: AngularFirestore) {

  }

  async buscarTorneios(ipSomenteAtivos: boolean): Promise<Torneio[]> {
    try {

      let vaResult = [];
      let vaTorneiosRef = this.firestore.collection('torneios').ref;
      let vaSnapshot = undefined;
      if (ipSomenteAtivos) {
        vaSnapshot = await vaTorneiosRef.where("status", '==', 0).get()
      }

      if (vaSnapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      vaSnapshot.forEach(doc => {
        let vaTorneio = Object.assign(new Torneio(), doc.data());
        vaResult.push(vaTorneio);
      });

      return vaResult;

    } catch (error) {
      return [];
    }
  }
}
