import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { OverlayService } from '../servicos/overlay.service';
import { TorneioService } from '../servicos/torneio.service';
import { ServerApiResult, XadrezMineirosApi } from '../servicos/xadrezmineiros-api.service';

@Component({
  selector: 'app-torneio',
  templateUrl: './torneio.page.html',
  styleUrls: ['./torneio.page.scss'],
})
export class TorneioPage implements OnInit {
  torneio: Torneio;
  torneioForm: FormGroup;
  jogadorForm: FormGroup;
  ganhadores: Jogador[] = [];

  constructor(private route: ActivatedRoute,
    private serverApi:XadrezMineirosApi,
    private torneioService:TorneioService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.torneioForm = this.fb.group({
      nome: ['', [Validators.required]],
      qtde_rodadas: ['', [Validators.required]],
      ritmo: [10, [Validators.required]],      
      data_inicio: ['', [Validators.required]],
      descricao:['',[]]
    });

    this.jogadorForm = this.fb.group({
      username: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.carregarTorneio(this.route.snapshot.params.id);
  }

  isIniciado():boolean{
    return this.torneio?.status >= 1;
    return false;
  }

  async carregarTorneio(ipId: string) {
    if (ipId) {
      let vaTorneio = await this.serverApi.buscarTorneio(ipId);
      if (!Array.isArray(vaTorneio)){
        this.torneio = vaTorneio;
        if (this.torneio) {
          this.torneioForm.patchValue({
            nome: this.torneio.nome,
            qtde_rodadas: this.torneio.qtde_rodadas,
            ritmo: this.torneio.ritmo,        
            data_inicio: this.torneio.data_inicio.toISOString(),
            descricao: this.torneio.descricao
          });
        }
      }

      
    }

    if (!this.torneio) {
      this.torneio = new Torneio();
    }
  }

 async salvarTorneio(){
    await this.salvar();
    this.overlayService.toast({
      message:"Salvo com sucesso!",
      color:"success"
    })
  }

  async salvar() {
    if (this.torneio.status < 0) {
      this.torneio.status = 0;
    }
    this.torneio.nome = this.torneioForm.value.nome;
    this.torneio.qtde_rodadas = this.torneioForm.value.qtde_rodadas;
    this.torneio.ritmo = this.torneioForm.value.ritmo;    
    this.torneio.descricao = this.torneioForm.value.descricao;
    this.torneio.data_inicio = new Date(Date.parse(this.torneioForm.value.data_inicio));
    let vaResult:ServerApiResult = undefined;
    if (!this.torneio.id) {
      vaResult = await this.serverApi.incluirTorneio(this.torneio)
    } else {
      vaResult = await this.serverApi.atualizarTorneio(this.torneio);
    }   

    if (vaResult){
      if (vaResult.ok){
        this.overlayService.showInfoMsg('Salvo com sucesso!')
      }else{
        this.overlayService.showError(vaResult.error);
      }
    }
  }

  async excluir() {
    if (this.torneio.id) {
      this.overlayService.alert({
        message: "Confirma a exclusão?",
        buttons: [{
          text: "Sim",
          handler: async () => {
            let vaResult = await this.serverApi.excluirTorneio(this.torneio.id);
            if (vaResult.ok) {
              this.voltar();
            }else{
              this.overlayService.showError(vaResult.error);
            }
          }
        }, { text: "Não" }],
      })

    }
  }

  async iniciar() {
    let vaResult = await this.serverApi.iniciarTorneio(this.torneio.id);
    if (vaResult.ok){
      this.voltar();
    }else{
      this.overlayService.showError(vaResult.error);
    }
  }

 

  async pegarResultado(ipRodada: Rodada, ipPartida: Partida) {
    if (await this.torneioService.pegarResultado(this.torneio, ipRodada, ipPartida)) {
      this.salvar();
    } else {
      this.overlayService.toast({
        message: "Partida não encontrada",
        color: 'warning'
      })
    }
  }


  async adicionarJogador() {
    let vaJogador = await this.torneioService.buscarJogador(this.jogadorForm.value.username);
    if (vaJogador) {
      this.torneio.jogadores.push(vaJogador);      
    } else {
      this.overlayService.toast({
        message: "Jogador não encontrado",
        color: "warning"
      });
    }
    this.jogadorForm.reset();
  }

  removerJogador(ipJogador: Jogador) {
    let vaIndex = this.torneio.jogadores.findIndex(j => j.username == ipJogador.username);
    if (vaIndex >= 0) {
      this.torneio.jogadores.splice(vaIndex, 1);      
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/torneios');
  }

}
