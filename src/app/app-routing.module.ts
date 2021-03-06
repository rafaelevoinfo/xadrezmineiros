import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'torneios',
    
    loadChildren: () => import('./torneios/torneios.module').then(m => m.TorneiosPageModule)
  },
  {
    path: 'torneio',
    loadChildren: () => import('./torneio/torneio.module').then(m => m.TorneioPageModule)
  },
  {
    path: 'torneio/:id',
    loadChildren: () => import('./torneio/torneio.module').then(m => m.TorneioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)    
  }

];
@NgModule({
  imports: [    
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
