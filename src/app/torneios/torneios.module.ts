import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TorneiosPageRoutingModule } from './torneios-routing.module';

import { TorneiosPage } from './torneios.page';
import { CardComponent } from '../components/card/card.component';
// import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TorneiosPageRoutingModule
    // ,RoundProgressModule    
  ],
  declarations: [TorneiosPage, CardComponent]  
})
export class TorneiosPageModule {}
