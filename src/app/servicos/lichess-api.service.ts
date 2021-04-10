import { Injectable } from '@angular/core';

export class GameResult {
  jogadorBrancas: string;
  jogadorNegras: string;
  resultado: string;
  link_partida: string;
}

@Injectable({
  providedIn: 'root'
})
export class LichessApiService {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://lichess.org/api/';
  }


  addOption(ipCurrentOptions: string, ipNewOption: string): string {
    if (ipCurrentOptions) {
      ipCurrentOptions += '&' + ipNewOption;
    } else {
      ipCurrentOptions = ipNewOption;
    }

    return ipCurrentOptions;
  }

  async pegarResultadoJogos(ipUsername: string, options: any = null): Promise<GameResult[]> {
    //
    let vaUrl = `${this.baseUrl}games/user/${ipUsername}`;
    if (options) {
      let vaOptions = '';

      if (options.since) {
        vaOptions = this.addOption(vaOptions, 'since=' + options.since);
      }

      if (options.vs) {
        vaOptions = this.addOption(vaOptions, 'vs=' + options.vs);
      }

      if (options.max) {
        vaOptions = this.addOption(vaOptions, 'max=' + options.max);
      }

      if (options.rated) {
        vaOptions = this.addOption(vaOptions, 'rated=' + options.rated);
      }

      if (vaOptions) {
        vaUrl += '?' + vaOptions;
      }
    }

    const response = await window.fetch(vaUrl,
      {
        method: 'GET'
      });

    let vaGames: GameResult[] = [];
    let vaResult = await response.text();
    let vaLinhas = vaResult.split('\n');
    for (let i = 0; i < vaLinhas.length; i++) {
      let vaLinha = vaLinhas[i];
      if (vaLinha.startsWith('[Event')) {
        let vaGame = new GameResult();
        for (let j = i + 1; j < vaLinhas.length; j++) {
          vaLinha = vaLinhas[j];
          if (vaLinha.startsWith('[White')) {
            vaGame.jogadorBrancas = vaLinha.split('"')[1];
          }
          if (vaLinha.startsWith('[Black')) {
            vaGame.jogadorNegras = vaLinha.split('"')[1];
          }

          if (vaLinha.startsWith('[Site')) {
            vaGame.link_partida = vaLinha.split('"')[1];
          }

          if (vaLinha.startsWith('[Result')) {
            vaGame.resultado = vaLinha.split('"')[1];
            i = j + 1;
            vaGames.push(vaGame);

            break;
          }
        }
      }
    }
    return vaGames;

  }


}
