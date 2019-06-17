import { NgModule } from '@angular/core';
import { TabViewModule } from 'primeng/primeng';
import { ConsultaRoutingModule, routedComponents } from './consulta-routing.module';
import { ConsultaDetalheComponent } from './consulta-detalhe/consulta-detalhe.component';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe/consulta-detalhe-dados/consulta-detalhe-dados.component';

@NgModule({
  imports: [
    ConsultaRoutingModule,
    TabViewModule,
  ],
  declarations: [
    ...routedComponents,
    ConsultaDetalheComponent,
    ConsultaDetalheDadosComponent,

  ],
})
export class ConsultaModule { }
