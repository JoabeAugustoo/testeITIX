import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe/consulta-detalhe-dados/consulta-detalhe-dados.component';
import { Consulta } from 'src/app/models/consulta.model';
import { RetornoConsultasDTO } from 'src/app/models/DTO/retorno-consultas.dto';
import { ConsultaFilterDTO } from 'src/app/models/DTO/consultas-filter.dto';
import { ConsultaService } from 'src/app/services/consulta-service';
import { NotificationService } from 'src/app/services/notification-service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { Combobox } from 'src/app/models/combobox.model';
import { Column } from 'src/app/models/column.model';
import { Action } from 'src/app/models/action.model';
import { DateUtils } from 'src/app/utils/date-utils';
import { LazyLoadEvent } from 'primeng/primeng';
import { NotificationType } from 'src/app/models/enums/notification-type.enum';

@Component({
  selector: 'consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  // Variáveis do Formulário
  intervaloDatasConsultaValue: Date[] = [null, null];

  // Variável de controle da página
  loading: boolean = false;

  // Variáveis do datatable
  consultas: RetornoConsultasDTO[];
  consulta: Consulta;
  columns: Column[];
  actions: Action[];
  title: string;
  visible: boolean = false;

  // Variáveis de options
  medicosOptions: Combobox[];

  totalRecords: number;
  itemsPerPage: number = 10;
  first: number = 0;
  filter: ConsultaFilterDTO;
  dadosRota: any;


  constructor(
    private consultaService: ConsultaService,
    private notificationService: NotificationService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
    private dateService: DateUtils
  ) { }

  ngOnInit() {
    this.filter = new ConsultaFilterDTO();
    this.initializeOptions();
    this.initializeDatatable();
  }

  id: number;
  nomePaciente: string;
  dataNascimento: Date;
  dataInicialConsulta: Date;
  dataFinalConsulta: Date;
  observacoes: string;
  medicoId: number;

  /**
   * Inicializa as opções do datatable.
   */
  initializeDatatable(): void {
    this.columns = [
      { field: 'nomePaciente', header: 'Nome Paciente', width: '100px' },
      { field: 'dataNascimento', header: 'Data Nascimento', valueDisplayFn: (value: Date) => value ? this.dateService.dateToString(new Date(value)) : null, width: '100px' },
      { field: 'dataInicialConsulta', header: 'Data Inicial da Consulta', valueDisplayFn: (value: Date) => value ? this.dateService.dateToString(new Date(value)) : null, width: '100px' },
      { field: 'dataFinalConsulta', header: 'Data Final da Consulta', valueDisplayFn: (value: Date) => value ? this.dateService.dateToString(new Date(value)) : null, width: '100px' },
      { field: 'observacoes', header: 'Observações', width: '100px' },
      { field: 'medicoId', header: 'Médico', width: '100px', valueDisplayFn: (value: number) => value ? this.getMedicoName(value) : null }
    ];
    // Inicialização das ações
    this.actions = [
      {
        title: 'Consultar Consulta', icon: 'glyphicon-search',
      },
      {
        title: 'Editar Consulta', icon: 'glyphicon-edit',
      },
      {
        title: 'Remover Consulta', icon: 'glyphicon glyphicon-remove',
      },
    ];
    this.pesquisarConsultas();
  }

  /**
   * Carrega todos os processos do sistema.
   *
   * @param event evento lazy load
   * @param filter filtros escolhidos
   */
  loadConsultas(event?: LazyLoadEvent, filter?: ConsultaFilterDTO): void {
    this.loading = true;
    this.first = event ? event.first : 0;
    const page: number = event ? Math.floor((event.first || 0) / this.itemsPerPage) + 1 : 1;
    const sortField: string = event && event.sortField ? event.sortField : null;
    const sortOrder: number = event && event.sortOrder ? event.sortOrder : null;
    this.consultas = [];
    this.consultaService.getConsultasByFilter(page, this.itemsPerPage, this.filter, sortField, sortOrder).subscribe(
      consultas => {
        if (consultas) {
          this.consultas = consultas['resultado'];
          this.totalRecords = consultas['totalItens'];
          this.loading = false;
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        throw error;
      }
    );
    this.loading = false;
    this.cdr.detectChanges();
  }

  /**
   * Carrega as opções dos componentes que usam o Select Item.
   */
  initializeOptions(): void {
    this.medicosOptions = [
      { descricao: 'João Mário', id: 1 },
      { descricao: 'César Augusto', id: 2 },
      { descricao: 'Maria Fernanda', id: 3 },
      { descricao: 'Ana Luiza', id: 4 },
      { descricao: 'Luiz Guilherme', id: 5 },
      { descricao: 'Júlia Gabriela', id: 6 },
    ];
  }

  getMedicoName(idMedico: number): string {
    const nomeMedico = this.medicosOptions.find(m => m.id == idMedico);
    return nomeMedico.descricao;
  }

  /**
   * Trata a ação recebida pelo datatable.
   *
   * @param event evento contendo a ação e o devido objeto
   */
  onAction(event: any): void {
    switch (event.action) {
      case 'Consultar Consulta':
        this.consultarConsulta(event.object);
        break;
      case 'Editar Consulta':
        this.editarConsulta(event.object);
        break;
      case 'Excluir Consulta':
        this.excluirConsulta(event.object);
        break;
      default:
        this.notificationService.notify('Funcionalidade não permitida.', NotificationType.error);
        break;
    }
  }

  /**
    * Cancela a operação atual
    *
  */
  cancelar(): void {
    this.confirmDialogService.confirm({
      message: 'Todas as informações preenchidas serão perdidas. Deseja continuar?',
      accept: () => {
        this.close();
        this.router.navigate(['consulta']);
      },
    });
  }

  /**
    * Fecha a caixa de modal.
  */
  close(): void {
    this.visible = false;
  }


  /**
   * Redireciona o usuário para a tela de visualizar detalhes da consulta.
   *
   * @param consulta consulta a ser visualizada
   */
  consultarConsulta(consulta: any): void {
    this.router.navigate([`consulta/detalhe/${consulta.id}`]);
  }

  /**
 * Redireciona o usuário para a tela de alterar os detalhes da consulta.
 *
 * @param consulta consulta a ser visualizada
 */
  editarConsulta(consulta: any): void {
    this.router.navigate([`consulta/detalhe/${consulta.id}`]);
  }

  /**
   * Redireciona o usuário para a página de inclusão de consulta.
   */
  incluirConsulta(): void {
    this.router.navigate([`consulta/incluir`]);
  }


  excluirConsulta(consulta: any): void {
    this.loading = true;
    this.consultaService.excluirConsulta(consulta.id).subscribe(
      response => {
        if (response) {
          this.notificationService.notify('Consulta excluída com sucesso!', NotificationType.success);
          this.loading = false;
        }
      }, error => {
        throw error;
        this.loading = false;
      }
    )
  }

  /**
   * Realiza a consulta no backend com os filtros.
   */
  pesquisarConsultas() {
    this.filter.dataInicialConsulta = this.intervaloDatasConsultaValue[0];
    this.filter.dataFinalConsulta = this.intervaloDatasConsultaValue[1];

    if (this.filter.dataFinalConsulta) {
      this.filter.dataFinalConsulta.setHours(23, 59, 59, 999);
    }

    //Converter intervalo de datas
    this.loadConsultas(null, this.filter);
  }

}
