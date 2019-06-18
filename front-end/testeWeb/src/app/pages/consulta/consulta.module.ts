import { NgModule } from '@angular/core';
import { TabViewModule, InputMaskModule, InputTextModule, TreeTableModule, RadioButtonModule, ButtonModule, PanelModule } from 'primeng/primeng';
import { ConsultaRoutingModule, routedComponents } from './consulta-routing.module';
import { ConsultaDetalheComponent } from './consulta-detalhe/consulta-detalhe.component';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe/consulta-detalhe-dados/consulta-detalhe-dados.component';
import { ConsultaComponent } from './consulta.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MainContentModule } from 'src/app/components/main-content/main-content.module';
import { TesteConfirmDialogModule } from 'src/app/components/confirm-dialog/confirm-dialog.module';

@NgModule({
  imports: [
    ConsultaRoutingModule,
    TabViewModule,
    PanelModule,
    RadioButtonModule,
    TreeTableModule,
    InputTextModule,
    TesteConfirmDialogModule,
    MainContentModule,
    InputMaskModule,
    FormsModule,
    TableModule,
    ButtonModule
  ],
  declarations: [
    ...routedComponents,
    ConsultaComponent,
    ConsultaDetalheComponent,
    ConsultaDetalheDadosComponent
  ],
})
export class ConsultaModule { }
