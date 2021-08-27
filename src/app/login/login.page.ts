import { Component, OnInit } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { OverlayService } from '../servicos/overlay.service';
import { XadrezMineirosApi } from '../servicos/xadrezmineiros-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  constructor(private serverApi: XadrezMineirosApi,
    private navCtrl: NavController,
    private overlay: OverlayService) { }

  ngOnInit() {

  }

  get debug(): boolean {
    return !environment.production
  }

  async login(ipEmail: IonInput, ipSenha: IonInput) {
    let vaToken = await this.serverApi.login(ipEmail, ipSenha);
    if (vaToken) {
      this.navCtrl.navigateRoot('/torneios')
    } else {
      this.overlay.toast({
        message: 'Login/senha incorretos',
        color: "warning"
      })
    }

    ipEmail.value = '';
    ipSenha.value = '';   
  }

  logout() {
    this.serverApi.logout();
  }
}
