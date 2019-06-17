import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService, Combobox } from 'pmv-common';
import { Processo_Pendencia } from '../../../../models/processo-pendencia.model';
import { PendenciaService } from '../../../../services/pendencia.service';
import { SIPADProcesso } from '../../../../models/sipad-processo.model';
import { ActivatedRoute } from '@angular/router';
import { Geral_OrgaoPMV } from '../../../../models/geral-orgao-pmv.model';
import { CalcularPrazoDTO } from '../../../../models/dtos/calcular-prazo.dto';
import { wrappedError } from '@angular/core/src/error_handler';
import { getSituacaoDocumentoDescById } from '../../../../models/enums/situacao-documento.enum';
import { getSituacaoPendenciaDesc } from '../../../../models/enums/situacao-pendencia.enum';
import { Consulta } from 'src/app/models/consulta.model';

@Component({
  selector: 'consulta-detalhe-dados',
  templateUrl: './consulta-detalhe-dados.component.html',
  styleUrls: ['./consulta-detalhe-dados.component.css']
})
export class ConsultaDetalheDadosComponent implements OnInit {

  @Input() isFormTypeView: boolean;
  @Input() isFormTypeCreate: boolean;
  @Input() isFormTypeUpdate: boolean;
  @Input() medicosOptions: any[];

  // Two-way data binding da consulta
  _consulta: Consulta;
  @Input() get consulta() { return this._consulta; }
  @Output() autoChange = new EventEmitter<Consulta>();
  set consulta(consulta: Consulta) {
    if (this._consulta !== consulta) {
      this._consulta = consulta;
      this.autoChange.emit(consulta);
    }
  }

  constructor(
    private consultaService: ConsultaService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initializeOptions();
  }

  initializeOptions(): void {
    this.carregandoOrgaos = true;
    this.pendenciaService.getOrgaosPMV().subscribe(
      response => {
        this.orgaosOptions = response['result'];
        this.carregandoOrgaos = false;
      },
      error => {
        this.carregandoOrgaos = true;
        throw error;
      });
  }

  /**
   * Método que busca as informações do Processo SIPAD.
   */
  findProcessoSipad() {
    const numAnoProcessoSIPAD: string[] = this.pendencia.numeroAnoProcessoMask ? this.pendencia.numeroAnoProcessoMask.split('/') : [];

    if (numAnoProcessoSIPAD.length === 2) {
      this.filter.numeroProcesso = Number(numAnoProcessoSIPAD[0]);
      this.filter.anoProcesso = Number(numAnoProcessoSIPAD[1]);
      this.pendenciaService.getProcessoSipad(this.filter).subscribe(
        response => {
          if (!response || !response['result']) {
            this.clearProcessoSIPAD();
            this.notificationService.notifyInfo('Processo SIPAD não encontrado.');
          } else {
            const res: SIPADProcesso = response['result'];
            if (res.situacao !== 9) {
              const situacao: string = getSituacaoPendenciaDesc(res.situacao);
              this.notificationService.notifyError('Só é permitido cadastrar pendências para processo na situação Aguardando Interessado e o processo informado encontra-se na situação: ' + '" ' + situacao + ' " .');
            } else {
              this.clearProcessoSIPAD();
              this.initializeProcesso(res);
            }
          }
        }, error => {
          throw error;
        });
    } else if (numAnoProcessoSIPAD.length === 1) {
      this.clearProcessoSIPAD();
      this.notificationService.notifyError('Informe o ano e número do processo SIPAD separados por uma "/".');
    } else {
      this.clearProcessoSIPAD();
    }
  }

  clearProcessoSIPAD(): void {
    this.pendencia.processo = new SIPADProcesso();
    this.pendencia.processo.requerente = null;
    this.pendencia.processo.dataCadastro = null;
    this.pendencia.orgaoPMVDescricao = null;
    this.pendencia.orgaoPMVId = null;
  }

  initializeProcesso(processoSIPAD: SIPADProcesso): void {
    this.pendencia.processo.requerente = processoSIPAD.requerente;
    this.pendencia.processo.dataCadastro = new Date(processoSIPAD.dataCadastro);

    this.preencherOrgao(processoSIPAD);
  }

  preencherOrgao(processoSIPAD: SIPADProcesso) {
    if (this.orgaosOptions) {
      const existeOrgao = this.orgaosOptions.find(orgao => orgao.id == processoSIPAD.orgaoPMV);
      if (existeOrgao) {
        this.pendencia.orgaoPMVId = processoSIPAD.orgaoPMV;
        this.pendencia.orgaoPMVDescricao = existeOrgao.descricao;
      } else {
        this.notificationService.notifyError('O órgão do processo selecionado não pertence ao Documentar. Favor infomar outro processo.');
        this.clearProcessoSIPAD();
      }
    } else {
      setTimeout(_ => {
        this.preencherOrgao(processoSIPAD);
      }, 500);
    }
  }

  clearErroPrazoDiasUteis() {
    this.pendencia.numDiasPrazo = null;
    this.pendencia.dataPrazo = null;
  }

  clearSucessoPrazoDiasUteis() {
    this.pendencia.dataPrazo = null;
  }

  preencheDataPrazo(res: CalcularPrazoDTO) {
    this.pendencia.dataPrazo = new Date(res.dataRetorno);
  }

  calcularDiasUteis() {
    if (this.pendencia.numDiasPrazo >= 1) {
      this.pendenciaService.calcularPrazo(this.pendencia).subscribe(
        response => {
          if (response) {
            const res: CalcularPrazoDTO = response['result'];
            this.clearSucessoPrazoDiasUteis();
            this.preencheDataPrazo(res);
          } else if (!this.pendencia.numDiasPrazo) {
            this.clearErroPrazoDiasUteis();
          } else {
            this.clearErroPrazoDiasUteis();
            this.notificationService.notifyInfo('Por favor informe um prazo em dias válido.');
          }
        }, error => {
          throw error;
        }
      );
    } else {
      this.clearErroPrazoDiasUteis();
      this.notificationService.notifyInfo('Por favor informe um prazo de pelo menos 1 dia útil.');
    }
  }

}
