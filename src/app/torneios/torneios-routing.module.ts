import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TorneiosPage } from './torneios.page';

const routes: Routes = [
  {
    path: '',
    component: TorneiosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TorneiosPageRoutingModule { }
