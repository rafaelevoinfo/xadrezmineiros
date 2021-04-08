import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TorneioPage } from './torneio.page';

const routes: Routes = [
  {
    path: '',
    component: TorneioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TorneioPageRoutingModule {}
