import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaComponent } from './consulta.component';
import { ConsultaDetalheComponent } from './consulta-detalhe/consulta-detalhe.component';

const routes: Routes = [
  { path: '', component: ConsultaComponent },
  { path: 'incluir', component: ConsultaDetalheComponent },
  { path: 'editar/:id', component: ConsultaDetalheComponent },
  { path: 'detalhe/:id', component: ConsultaDetalheComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaRoutingModule { }

export const routedComponents = [
  ConsultaComponent,
  ConsultaDetalheComponent,
];
