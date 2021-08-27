import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { OverlayService } from '../servicos/overlay.service';
import { TorneioService } from '../servicos/torneio.service';
import { XadrezMineirosApi } from '../servicos/xadrezmineiros-api.service';

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
      this.torneio = await this.serverApi.buscarTorneio(ipId);

      if (this.torneio) {
        this.torneioForm.patchValue({
          nome: this.torneio.nome,
          qtde_rodadas: this.torneio.qtde_rodadas,
          ritmo: this.torneio.ritmo,        
          data_inicio: this.torneio.data_inicio.toISOString(),
          descricao: this.torneio.descricao
        });

        // if (this.torneio.status == 1) {
        //   let vaAchou = await this.torneioService.buscarResultados(this.torneio);
        //   let vaMudou = this.torneioService.processarRodada(this.torneio);
        //   if ((vaMudou) || (vaAchou)) {
        //     this.salvar();
        //   }
        // }

        // if (this.torneio.status == 2) {
        //   this.ganhadores = this.torneioService.ranking(this.torneio);
        // }
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
    if (!this.torneio.id) {
      await this.serverApi.incluirTorneio(this.torneio)
    } else {
      await this.serverApi.atualizarTorneio(this.torneio);
    }   
  }

  async excluir() {
    if (this.torneio.id) {
      this.overlayService.alert({
        message: "Confirma a exclusão?",
        buttons: [{
          text: "Sim",
          handler: async () => {
            if (await this.serverApi.excluirTorneio(this.torneio.id)) {
              this.voltar();
            }
          }
        }, { text: "Não" }],
      })

    }
  }

  async iniciar() {
    // if (await this.serverApi.iniciarTorneio(this.torneio)) {
    //   this.voltar();
    // }
  }

  async pegarResultado(ipRodada: Rodada, ipPartida: Partida) {
    // if (await this.torneioService.pegarResultado(this.torneio, ipRodada, ipPartida)) {
    //   this.salvar();
    // } else {
    //   this.overlayService.toast({
    //     message: "Partida não encontrada",
    //     color: 'warning'
    //   })
    // }
  }


  async adicionarJogador() {
    // let vaJogador = await this.torneioService.buscarJogador(this.jogadorForm.value.username);
    // if (vaJogador) {
    //   this.torneio.jogadores.push(vaJogador);
    //   this.salvar();
    // } else {
    //   this.overlayService.toast({
    //     message: "Jogador não encontrado",
    //     color: "warning"
    //   });
    // }
    // this.jogadorForm.reset();
  }

  removerJogador(ipJogador: Jogador) {
    let vaIndex = this.torneio.jogadores.findIndex(j => j.username == ipJogador.username);
    if (vaIndex >= 0) {
      this.torneio.jogadores.splice(vaIndex, 1);
      this.salvar();
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/torneios');
  }

}
