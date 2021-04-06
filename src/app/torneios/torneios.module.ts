import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TorneiosPageRoutingModule } from './torneios-routing.module';

import { TorneiosPage } from './torneios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TorneiosPageRoutingModule
  ],
  declarations: [TorneiosPage]
})
export class TorneiosPageModule {}
