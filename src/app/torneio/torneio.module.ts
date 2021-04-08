import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TorneioPageRoutingModule } from './torneio-routing.module';

import { TorneioPage } from './torneio.page';
import { TabBarComponent } from '../components/tab-bar/tab-bar.component';
import { TabItemComponent } from '../components/tab-item/tab-item.component';
import { TabContentComponent } from '../components/tab-content/tab-content.component';
import { TabControlComponent } from '../components/tab-control/tab-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TorneioPageRoutingModule
  ],
  declarations: [TorneioPage, TabBarComponent, TabItemComponent, TabContentComponent, TabControlComponent]
})
export class TorneioPageModule { }
