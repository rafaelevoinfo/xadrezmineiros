import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Jogador, Partida, Rodada, Torneio } from '../Models/types';
import { LichessApiService } from '../servicos/lichess-api.service';
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

  constructor(private route: ActivatedRoute,
    private torneioService: TorneioService,
    private chessApi: LichessApiService,
    private fb: FormBuilder,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.torneioForm = this.fb.group({
      nome: ['', [Validators.required]],
      qtde_rodadas: ['', [Validators.required]],
    });
    this.jogadorForm = this.fb.group({
      nome: ['', [Validators.required]],
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
        });
      }
    }

    if (!this.torneio) {
      this.torneio = new Torneio();
      console.log('Novo torneio');
    }
  }

  salvar() {
    this.torneio.nome = this.torneioForm.value.nome;
    this.torneio.qtde_rodadas = this.torneioForm.value.qtde_rodadas;
    if (!this.torneio.id) {
      if (this.torneioService.criarTorneio(this.torneio)) {
        this.voltar()
      }
    } else {
      if (this.torneioService.atualizarTorneio(this.torneio)) {
        this.voltar();
      }
    }
  }

  async excluir() {
    if (this.torneio.id) {
      if (await this.torneioService.excluirTorneio(this.torneio.id)) {
        this.voltar();
      }
    }
  }

  async iniciar() {
    if (await this.torneioService.iniciarTorneio(this.torneio)) {
      this.voltar();
    }
  }

  async pegarResultado(ipRodada: Rodada, ipPartida: Partida) {
    let vaResultados = await this.chessApi.pegarResultadoJogos(ipPartida.jogadorBrancas.username, {
      vs: ipPartida.jogadorNegras.username,
      max: 1,
      rated: true,
      since: ipRodada.data_inicio.getTime()
    });

    console.log(vaResultados);
  }


  adicionarJogador() {
    let vaJogador = new Jogador();
    vaJogador.nome = this.jogadorForm.value.nome;
    vaJogador.username = this.jogadorForm.value.username;
    this.torneio.jogadores.push(vaJogador);

    this.jogadorForm.reset();

  }

  voltar() {
    this.navCtrl.navigateBack('/torneios');
  }

}
