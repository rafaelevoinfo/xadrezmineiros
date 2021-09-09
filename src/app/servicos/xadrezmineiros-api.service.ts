import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Storage } from "@capacitor/storage";
import { Torneio } from "../Models/types";


export class ServerApiResult{
  ok:boolean;
  error?:string;

  constructor(ok:boolean, error?:string){
    this.ok = ok;
    this.error = error;
  }
}

@Injectable({ providedIn: "root" })
export class XadrezMineirosApi {
  baseUrl: string;
  token: string;

  constructor() {
    this.baseUrl = environment.api_url;
    this.token = null;
    Storage.get({
      key: 'token'
    }).then(pair => {
      this.token = pair.value
    }).catch(reason => {
      this.token = null
    });
  }

  async login(ipEmail, ipSenha) {
    let vaCredenciais = JSON.stringify({
      email: ipEmail.value,
      senha: ipSenha.value,
    })


    const vaRawResponse = await window.fetch(this.baseUrl + '/login', {
      method: "POST",
      body: vaCredenciais,
      headers: new Headers({
        'content-type': 'application/json'
      })
    })



    if (await vaRawResponse.ok) {
      let vaJsonResponse = await vaRawResponse.json();
      if ((vaJsonResponse.auth) && (vaJsonResponse.token)) {
        this.token = vaJsonResponse.token;

        await Storage.set({
          key: "token",
          value: this.token
        })
        return this.token
      }
    } else {
      return false
    }
  }

  logout() {
    this.token = '';
    Storage.remove({ key: 'token' });
  }

  isLogado(): boolean {
    return this.token != null;    
  }

  async buscarTorneios(ipSomenteAtivos: boolean) {
    let vaUrl = '/torneios'
    if (!ipSomenteAtivos) {
      vaUrl += '?inativos=true'
    }
    const vaRawResponse = await this.get(vaUrl);

    if (await vaRawResponse.ok) {
      let vaTorneios = await vaRawResponse.json();
      return vaTorneios
    } else {
      return false
    }
  }

  async buscarTorneio(ipId: string): Promise<Torneio> {
    const vaRawResponse = await this.get('/torneio/' + ipId);

    if (vaRawResponse.ok) {
      let vaTorneio: Torneio = await vaRawResponse.json();
      vaTorneio.data_inicio = new Date(vaTorneio.data_inicio);
      if (!environment.production) {
        console.log(vaTorneio)
      }
      return vaTorneio
    } else {
      return null
    }
  }

  async tratarRetornoServer(ipRawResponse:Response):Promise<ServerApiResult>{
    if (ipRawResponse.ok){
      return new ServerApiResult(true);
    }else{      
      return new ServerApiResult(false,  await ipRawResponse.text());
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

  async iniciarTorneio(ipId:string):Promise<ServerApiResult>{
    let vaRawResponse = await this.put('/torneio/start/' + ipId, null);
    return this.tratarRetornoServer(vaRawResponse); 
        
  }

  async delete(ipUrl: string): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'DELETE',
      headers: this.criarAuthHeader()
    });
  }

  async put(ipUrl: string, ipBody: any): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'PUT',
      headers: this.criarAuthHeader(),
      body: ipBody?JSON.stringify(ipBody):''
    });
  }

  async post(ipUrl: string, ipBody: any): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      method: 'POST',
      headers: this.criarAuthHeader(),
      body: JSON.stringify(ipBody)
    });
  }

  async get(ipUrl: string): Promise<Response> {
    return await fetch(this.baseUrl + ipUrl, {
      headers: this.criarAuthHeader()
    })
  }

  private criarAuthHeader(): Headers {
    return new Headers({
      'x-access-token': this.token
    })
  }
}