import { Component, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormType } from '../../../models/enums/form-type.enum';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe-dados/consulta-detalhe-dados.component';
import { ConsultaService } from 'src/app/services/consulta-service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { NotificationService } from 'src/app/services/notification-service';
import { RetornoConsultasDTO } from 'src/app/models/DTO/retorno-consultas.dto';
import { Consulta } from 'src/app/models/consulta.model';
import { DetailComponent } from '../../interfaces/detail-component.interface';

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


  @ViewChild(ConsultaDetalheDadosComponent, {static: false}) dadosComponent: ConsultaDetalheDadosComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private notificationService: NotificationService,
    private consultaService: ConsultaService,
  ) {
    super(route);
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
        this.loading = false;
      }, error => {
        this.loading = false;
        throw error;
      });
  }

  /**
   * Realiza as validações necessárias para inserção ou atualização do registro
   *
   * @param form
   */
  handleValidSubmission(form: NgForm): void {
    if (this.consulta.id) {
      this.updateConsulta();
    } else {
      this.addConsulta();
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
      consulta => {
        this.consulta = consulta;
        this.notificationService.notifySuccess('Salvo com sucesso!');
        this.loading = false;
        this.router.navigate(['consulta']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }


  /**
   * Modifica uma consulta no banco de dados.
   *
   *
   */
  updateConsulta(): void {
    this.loading = true;
    this.consultaService.addConsulta(this.consulta).subscribe(
      consulta => {
        this.consulta = consulta;
        this.notificationService.notifySuccess('Modificado com sucesso!');
        this.loading = false;
        this.router.navigate(['consulta']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }

}


