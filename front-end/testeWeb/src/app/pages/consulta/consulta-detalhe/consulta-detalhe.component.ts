import { Component, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DetailComponent } from '../../../shared/interfaces/detail-component.interface';
import { FormType } from '../../../models/enums/form-type.enum';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe-dados/consulta-detalhe-dados.component';
import { ConsultaService } from 'src/app/services/consulta-service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { NotificationService } from 'src/app/services/notification-service';
import { RetornoConsultasDTO } from 'src/app/models/DTO/retorno-consultas.dto';
import { Consulta } from 'src/app/models/consulta.model';

@Component({
  selector: 'consulta-detalhe',
  templateUrl: './consulta-detalhe.component.html',
  styleUrls: ['./consulta-detalhe.component.css']
})
export class ConsultaDetalheComponent extends DetailComponent implements OnInit {

  loading: boolean = false;
  title: string;
  salvarLoading: boolean = false;
  consultas: RetornoConsultasDTO = new RetornoConsultasDTO();
  consulta: Consulta = new Consulta();
  formType: FormType;


  @ViewChild(ConsultaDetalheDadosComponent) dadosComponent: ConsultaDetalheDadosComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private notificationService: NotificationService,
    private consultaService: ConsultaService,
  ) {
    super(route, notificationService);
  }

  ngOnInit() {
    this.loadRouteData();
  }

  /**
   * Recupera os dados da rota.
   *
   */
  loadRouteData(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    switch (this.formType) {
      case FormType.create:
        this.title = 'Inclusão de Consultas';
        break;
      case FormType.update:
        this.title = 'Alteração de Consultas';
        this.loadData(id);
        break;
      case FormType.view:
        this.title = 'Consulta de Consultas';
        this.loadData(id);
        break;
    }
  }

  /**
   * Carrega os dados da pendencia, caso seja uma edição, detalhe, resposta ou avaliação.
   *
   * @param id id da pendência
   */
  loadData(id: number): void {
    this.loading = true;
    this.consultaService.getConsultaById(id).subscribe(
      consulta => {
        this.consulta = consulta['result'];
        this.consulta.documentosPendentes.forEach(
          (doc: Processo_PendenciaDocumentoSolicitado) => {
            doc.documentoAceito = (doc.situacaoDocumentoSolicitadoId === 1) ? false : true;
            doc.possuiArquivo = (doc.nomeArquivo) ? true : false;
          }
        );
        this.consulta.dataCadastro = new Date(consulta['result'].dataCadastro.toString());
        this.consulta.dataPrazo = new Date(consulta['result'].dataPrazo.toString());
        this.consulta.numeroAnoProcessoMask = this.consulta.numeroProcesso.toString() + "/" + this.consulta.anoCadastro.toString();
        this.consulta.processo = new SIPADProcesso();
        this.filter.numeroProcesso = this.consulta.numeroProcesso;
        this.filter.anoProcesso = this.consulta.anoCadastro;
        this.loading = false;
        this.pendenciaService.getProcessoSipad(this.filter).subscribe(
          response => {
            const res: SIPADProcesso = response['result'];
            this.clearProcessoSIPAD();
            this.initializeProcesso(res);
          }, error => {
            this.loading = false;
            throw error;
          });
      }, error => {
        this.loading = false;
        throw error;
      });
    this.loading = false;
  }

  /**
   * Realiza as validações necessárias para inserção ou atualização do registro
   *
   * @param form
   */
  handleValidSubmission(form: NgForm): void {
    const numAnoProcessoSIPAD: string[] = this.consulta.numeroAnoProcessoMask ? this.consulta.numeroAnoProcessoMask.split('/') : [];
    this.consulta.numeroProcesso = Number(numAnoProcessoSIPAD[0]);
    this.consulta.anoCadastro = Number(numAnoProcessoSIPAD[1]);

    const existeDocPendente = this.consulta.documentosPendentes.every(documento =>
      Boolean(documento.tipoDocumentoId));

    if (this.consulta.id) {
      if (!this.consulta.processo.requerente || !this.consulta.processo.dataCadastro) {
        this.notificationService.notifyInfo('É necessário informar um processo válido do SIPAD.');
      }
      else if (this.consulta.documentosPendentes.length === 0 || !existeDocPendente) {
        this.notificationService.notifyError('É necessário informar ao menos um documento para a pendência.');
      }
      else {
        this.pendenciaService.validarPendenciaEmAberto(this.consulta).subscribe(
          response => {
            if (response) {
              this.notificationService.notifyError("Já existe pendência em aberto para o processo SIPAD informado.");
            }
          }, error => {
            throw error;
          });
      }
    } else {
      if (!this.consulta.processo.requerente || !this.consulta.processo.dataCadastro) {
        this.notificationService.notifyInfo('É necessário informar um processo válido do SIPAD.');
      }
      else if (this.consulta.documentosPendentes.length === 0 || !existeDocPendente) {
        this.notificationService.notifyError('É necessário informar ao menos um documento para a pendência.');
      }
      else {
        this.pendenciaService.validarPendenciaEmAberto(this.consulta).subscribe(
          response => {
            if (response) {
              this.notificationService.notifyError("Já existe pendência em aberto para o processo informado.");
            } else {
              this.addPendencia();
            }
          }, error => {
            throw error;
          }
        );
      }
    }
  }

  /**
  * Cancela a operação atual
  *
  */
  cancelar(): void {
    if (this.formType !== FormType.view) {
      this.confirmDialogService.confirm({
        message: 'Todas as informações preenchidas serão perdidas. Deseja continuar?',
        accept: () => {
          this.router.navigate(['consulta']);
        },
      });
    } else {
      this.router.navigate(['consulta']);
    }
  }

  /**
   * Adiciona uma nova consulta no banco de dados.
   *
   *
   */
  addConsulta(): void {
    this.loading = true;
    this.consultaService.addConsulta(this.consulta).subscribe(
      pendencia => {
        this.consulta = pendencia;
        this.notificationService.notifySuccess('Salvo com sucesso!');
        this.loading = false;
        this.router.navigate(['consulta']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }

}


