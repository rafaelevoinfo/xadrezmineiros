import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';
import { Torneio } from '../Models/types';
import { ok } from 'assert';

export interface ServerApiResult {
  ok: boolean;
  dados?: string;
  error?: string;

  // public constructor(init?: Partial<ServerApiResult>) {
  //   Object.assign(this, init);
  // }
}

interface IFiltrosPesquisa{
  somente_ativos:boolean;
  nome?:string;
}

type CallbackFunction = () => Promise<Torneio | Torneio[]>;

@Injectable({ providedIn: 'root' })
export class XadrezMineirosApi {
  baseUrl: string;
  token: string;

  constructor() {
    this.baseUrl = environment.api_url;
    this.token = null;
    Storage.get({
      key: 'token',
    })
      .then((pair) => {
        this.token = pair.value;
      })
      .catch((reason) => {
        this.token = null;
      });
  }

  async login(ipEmail, ipSenha) {
    let vaCredenciais = JSON.stringify({
      email: ipEmail.value,
      senha: ipSenha.value,
    });

    const vaRawResponse = await window.fetch(this.baseUrl + '/login', {
      method: 'POST',
      body: vaCredenciais,
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    if (await vaRawResponse.ok) {
      let vaJsonResponse = await vaRawResponse.json();
      if (vaJsonResponse.auth && vaJsonResponse.token) {
        this.token = vaJsonResponse.token;

        await Storage.set({
          key: 'token',
          value: this.token,
        });
        return this.token;
      }
    } else {
      return false;
    }
  }

  logout() {
    this.token = '';
    Storage.remove({ key: 'token' });
  }

  isLogado(): boolean {
    return !!this.token;
  }

  async buscarTorneios(ipFiltros:IFiltrosPesquisa): Promise<Torneio | Torneio[]> {
    return await this.buscar(async () => {
      let vaUrl = '/torneios';
      if (!ipFiltros.somente_ativos) {
        vaUrl += '?inativos=true';
      }
      if (ipFiltros.nome){
        if (vaUrl.includes('?')){
          vaUrl += '&nome='+ipFiltros.nome;
        }else{
          vaUrl += '?nome='+ipFiltros.nome;
        }
      }

      const vaRawResponse = await this.get(vaUrl);

      if (await vaRawResponse.ok) {
        let vaTorneios: Torneio[] = await vaRawResponse.json();
        if (vaTorneios) {
          vaTorneios.map((t) => {
            t.data_inicio = new Date(t.data_inicio);
            return t;
          });
        }
        return vaTorneios;
      } else {
        return null;
      }
    }, 'Erro ao buscar os torneios');
  }

  async buscarTorneio(ipId: string): Promise<Torneio | Torneio[]> {
    return await this.buscar(async () => {
      const vaRawResponse = await this.get('/torneio/' + ipId);

      if (vaRawResponse.ok) {
        let vaTorneio: Torneio = await vaRawResponse.json();
        vaTorneio.data_inicio = new Date(vaTorneio.data_inicio);
        if (!environment.production) {
          console.log(vaTorneio);
        }
        return vaTorneio;
      } else {
        return null;
      }
    }, 'Erro ao buscar um torneio');
  }

  async buscar(
    ipCallback: CallbackFunction,
    ipMsgErro: string
  ): Promise<Torneio | Torneio[]> {
    try {
      return await ipCallback();
    } catch (error) {
      console.log(`${ipMsgErro} Detalhes: ${error}`);
    }
  }

  async tratarRetornoServer(ipRawResponse: Response): Promise<ServerApiResult> {
    if (ipRawResponse.ok) {
      return {
        ok: true,
        dados: await ipRawResponse.text(),
      };
    } else {
      return {
        ok: false,
        error: await ipRawResponse.text(),
      };
    }
  }

  async incluirTorneio(ipTorneio: Torneio): Promise<ServerApiResult> {
    let vaRawResponse = await this.post('/torneio', ipTorneio);
    return this.tratarRetornoServer(vaRawResponse);
  }

  async atualizarTorneio(ipTorneio: Torneio): Promise<ServerApiResult> {
    let vaRawResponse = await this.put('/torneio/' + ipTorneio.id, ipTorneio);
    return this.tratarRetornoServer(vaRawResponse);
  }

  async excluirTorneio(ipId: string): Promise<ServerApiResult> {
    let vaRawResponse = await this.delete('/torneio/' + ipId);
    return this.tratarRetornoServer(vaRawResponse);
  }

  async iniciarTorneio(ipId: string): Promise<ServerApiResult> {
    let vaRawResponse = await this.put('/torneio/start/' + ipId, null);
    return this.tratarRetornoServer(vaRawResponse);
  }

  async delete(ipUrl: string): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'DELETE',
      headers: this.criarHeaders(),
    });
  }

  async put(ipUrl: string, ipBody: any): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'PUT',
      headers: this.criarHeaders(),
      body: ipBody ? JSON.stringify(ipBody) : '',
    });
  }

  async post(ipUrl: string, ipBody: any): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'POST',
      headers: this.criarHeaders(),
      body: JSON.stringify(ipBody),
    });
  }

  async get(ipUrl: string): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      headers: this.criarHeaders(),
    });
  }

  private criarHeaders(): Headers {
    return new Headers({
      'x-access-token': this.token,
      'content-type': 'application/json',
    });
  }
}
