import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { AuthService } from '../servicos/auth.service';
import { LichessApiService } from '../servicos/lichess-api.service';
import { OverlayService } from '../servicos/overlay.service';
import { TorneioService } from '../servicos/torneio.service';

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
    private torneioService: TorneioService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    public authService: AuthService) { }

  ngOnInit() {
    this.torneioForm = this.fb.group({
      nome: ['', [Validators.required]],
      qtde_rodadas: ['', [Validators.required]],
      ritmo_minutos: [10, [Validators.required]],
      ritmo_incremento: [3, [Validators.required]],
      data_inicio: ['', [Validators.required]]
    });

    this.jogadorForm = this.fb.group({
      username: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.carregarTorneio(this.route.snapshot.params.id);
  }

  async carregarTorneio(ipId: string) {
    if (ipId) {
      this.torneio = await this.torneioService.buscarTorneio(ipId);

      if (this.torneio) {
        this.torneioForm.patchValue({
          nome: this.torneio.nome,
          qtde_rodadas: this.torneio.qtde_rodadas,
          ritmo_minutos: this.torneio.ritmo_minutos,
          ritmo_incremento: this.torneio.ritmo_incremento,
          data_inicio: this.torneio.data_inicio.toISOString()
        });

        if (this.torneio.status == 1) {
          let vaAchou = await this.torneioService.buscarResultados(this.torneio);
          let vaMudou = this.torneioService.processarRodada(this.torneio);
          if ((vaMudou) || (vaAchou)) {
            this.salvar();
          }
        }

        if (this.torneio.status == 2) {
          this.ganhadores = this.torneioService.ranking(this.torneio);
        }
      }
    }

    if (!this.torneio) {
      this.torneio = new Torneio();
    }
  }

  salvar() {
    if (this.torneio.status < 0) {
      this.torneio.status = 0;
    }
    this.torneio.nome = this.torneioForm.value.nome;
    this.torneio.qtde_rodadas = this.torneioForm.value.qtde_rodadas;
    this.torneio.ritmo_minutos = this.torneioForm.value.ritmo_minutos;
    this.torneio.ritmo_incremento = this.torneioForm.value.ritmo_incremento;
    this.torneio.data_inicio = new Date(Date.parse(this.torneioForm.value.data_inicio));
    if (!this.torneio.id) {
      this.torneioService.incluirTorneio(this.torneio)
    } else {
      this.torneioService.atualizarTorneio(this.torneio);
    }
  }

  async excluir() {
    if (this.torneio.id) {
      this.overlayService.alert({
        message: "Confirma a exclusão?",
        buttons: [{
          text: "Sim",
          handler: async () => {
            if (await this.torneioService.excluirTorneio(this.torneio.id)) {
              this.voltar();
            }
          }
        }, { text: "Não" }],
      })

    }
  }

  async iniciar() {
    if (await this.torneioService.iniciarTorneio(this.torneio)) {
      this.voltar();
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
      this.salvar();
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
      this.salvar();
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/torneios');
  }

}
