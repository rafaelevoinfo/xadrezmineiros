import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonInput, NavController } from '@ionic/angular';
import { using } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servicos/auth.service';
import { OverlayService } from '../servicos/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  constructor(private auth: AngularFireAuth,
    public authService: AuthService,
    private navCtrl: NavController,
    private overlay: OverlayService) { }

  ngOnInit() {

  }

  get debug(): boolean {
    return !environment.production
  }

  login(ipEmail: IonInput, ipSenha: IonInput) {        
    this.auth.signInWithEmailAndPassword(ipEmail.value.toString(), ipSenha.value.toString())
      .then(user => {
        this.navCtrl.navigateRoot('/torneios');
      })
      .catch(e => {
        console.log('Erro', e);
        this.overlay.toast({
          message: 'Login/senha incorretos',
          color: "warning"
        })
      }).finally(() => {
        ipEmail.value = '';
        ipSenha.value = '';
      });
  }

  logout() {
    this.auth.signOut().then(() => {
      //this.auth.signInWithEmailAndPassword("anonimo@gmail.com", '123456');
    });
  }
}
