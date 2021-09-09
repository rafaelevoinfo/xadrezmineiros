import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AlertOptions, LoadingOptions, ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async alert(options?: AlertOptions): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create(options);
    await alert.present();
    return alert;
  }

  async showModalMsg(ipMensagem:string, options?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      message: ipMensagem,
      ...options
    });
    await loading.present();
    
    return loading;
  }

  async toast(options?: ToastOptions): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      position: 'bottom',
      duration: 3000,      
      ...options
    });
    await toast.present();
    return toast;
  }

  showError(ipError){
    this.toast({
      message: ipError,
      color:'warning'        
    })
  }

  showInfoMsg(ipMsg:string){
    this.toast({
      message: ipMsg,        
    })
  }
}