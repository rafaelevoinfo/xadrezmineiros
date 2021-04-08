import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Jogador, Torneio } from '../Models/types';
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
    private fb: FormBuilder,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.torneioForm = this.fb.group({
      nome: ['', [Validators.required]],
      rodadas: ['', [Validators.required]],
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
          rodadas: this.torneio.rodadas,
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
    this.torneio.rodadas = this.torneioForm.value.rodadas;
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

  excluir() {
    if (this.torneio.id) {
      if (this.torneioService.excluirTorneio(this.torneio.id)) {
        this.voltar();
      }
    }
  }

  iniciar() {
    this.torneio.status = 1;
    if (this.torneioService.atualizarTorneio(this.torneio)) {
      this.voltar();
    }
  }


  adicionarJogador() {
    let vaJogador = new Jogador();
    vaJogador.nome = this.jogadorForm.value.nome;
    vaJogador.username = this.jogadorForm.value.username;
    this.torneio.jogadores.push(vaJogador);

    if (this.torneioService.atualizarTorneio(this.torneio)) {
      this.jogadorForm.reset();
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/torneios');
  }

}
