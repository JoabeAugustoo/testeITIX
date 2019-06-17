import { Component, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfirmDialogService, NotificationService, Combobox, PMVAuthenticationService } from 'pmv-common';
import { DetailComponent } from '../../../shared/interfaces/detail-component.interface';
import { PendenciaService } from '../../../services/pendencia.service';
import { PesquisarPendencias } from '../../../models/pesquisar-pendencias.model';
import { Processo_Pendencia } from '../../../models/processo-pendencia.model';
import { SIPADProcesso } from '../../../models/sipad-processo.model';
import { SIPADInteressadoProcesso } from '../../../models/sipad-interessado-processo.model';
import { getSituacaoPendenciaAsList, SituacaoPendenciaEnum, getSituacaoPendenciaDescById } from '../../../models/enums/situacao-pendencia.enum';
import { Processo_PendenciaAnexo } from '../../../models/processo-pendencia-anexo.model';
import { Processo_PendenciaDocumentoSolicitado } from '../../../models/processo-pendencia-documento-solicitado.model';
import { SituacaoDocumentoEnum } from '../../../models/enums/situacao-documento.enum';
import { FormType } from '../../../models/enums/form-type.enum';
import { PendenciaDetalheDadosComponent } from './pendencia-detalhe-dados/pendencia-detalhe-dados.component';
import { ConsultaDetalheDadosComponent } from './consulta-detalhe-dados/consulta-detalhe-dados.component';
import { ConsultaService } from 'src/app/services/consulta-service';

@Component({
  selector: 'consulta-detalhe',
  templateUrl: './consulta-detalhe.component.html',
  styleUrls: ['./consulta-detalhe.component.css']
})
export class ConsultaDetalheComponent extends DetailComponent implements OnInit {

  tiposDocumento: Combobox[];

  documentosFiles: File[] = [];
  anexosFiles: File[] = [];
  anexos: Processo_PendenciaAnexo[];
  documentos: Processo_PendenciaDocumentoSolicitado[];
  loading: boolean = false;
  title: string;
  situacoesOptions: SituacaoPendenciaEnum[];
  codSituacoes: any;
  codPessoaLogada: string;
  salvarLoading: boolean = false;
  pendencias: PesquisarPendencias = new PesquisarPendencias();
  pendencia: Processo_Pendencia = new Processo_Pendencia();
  filter: {
    anoProcesso?: number,
    numeroProcesso?: number
  } = {};

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
    this.initializeOptions();
    this.loadRouteData();
  }

  /**
   * Inicializando menus e outros componentes.
   *
   */
  initializeOptions(): void {
    this.loading = true;
    this.situacoesOptions = getSituacaoPendenciaAsList(),
      this.pendenciaService.getTiposDocumento().subscribe(
        response => {
          const tiposDocumento: Combobox[] = response;
          this.tiposDocumento = tiposDocumento['result'];
          this.loading = false;
        }, error => {
          this.loading = false;
          throw error;
        });
  }

  /**
   * Recupera os dados da rota.
   *
   */
  loadRouteData(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    const numProcesso: number = Number(this.route.snapshot.queryParamMap.get('numProcesso'));
    const anoProcesso: number = Number(this.route.snapshot.queryParamMap.get('anoProcesso'));
    switch (this.formType) {
      case FormType.create:
        this.title = 'Inclusão de Pendências';
        this.preencherProcesso(numProcesso, anoProcesso);
        break;
      case FormType.update:
        this.title = 'Alteração de Pendências';
        this.loadData(id);
        break;
      case FormType.view:
        this.title = 'Consulta de Pendências';
        this.loadData(id);
        break;
      case FormType.avaliate:
        this.title = 'Avaliar a Pendência';
        this.loadData(id);
        break;
      case FormType.answer:
        this.title = 'Responder a Pendência';
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
    this.pendenciaService.getPendenciaById(id).subscribe(
      pendencia => {
        this.pendencia = pendencia['result'];
        this.pendencia.documentosPendentes.forEach(
          (doc: Processo_PendenciaDocumentoSolicitado) => {
            doc.documentoAceito = (doc.situacaoDocumentoSolicitadoId === 1) ? false : true;
            doc.possuiArquivo = (doc.nomeArquivo) ? true : false;
          }
        );
        this.pendencia.dataCadastro = new Date(pendencia['result'].dataCadastro.toString());
        this.pendencia.dataPrazo = new Date(pendencia['result'].dataPrazo.toString());
        this.pendencia.numeroAnoProcessoMask = this.pendencia.numeroProcesso.toString() + "/" + this.pendencia.anoCadastro.toString();
        this.pendencia.processo = new SIPADProcesso();
        this.filter.numeroProcesso = this.pendencia.numeroProcesso;
        this.filter.anoProcesso = this.pendencia.anoCadastro;
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

  preencherProcesso(numProcesso: number, anoProcesso: number) {
    setTimeout(_ => {
      if (numProcesso && anoProcesso) {
        this.pendencia.numeroAnoProcessoMask = `${numProcesso}/${anoProcesso}`;
        this.dadosComponent.findProcessoSipad();
      }
    }, 0);
  }

  /**
   * Limpa os campos relacionados ao Processo do SIPAD.
   *
   */
  clearProcessoSIPAD(): void {
    this.pendencia.processo.requerente = null;
    this.pendencia.processo.dataCadastro = null;
  }

  /**
   * Inicializa os campos relacionados ao Processo do SIPAD.
   *
   * @param processoSIPAD
   */
  initializeProcesso(processoSIPAD: SIPADProcesso): void {
    this.pendencia.processo.requerente = processoSIPAD.requerente;
    this.pendencia.processo.dataCadastro = new Date(processoSIPAD.dataCadastro);
    this.pendencia.situacaoDocumentoDescricao = getSituacaoPendenciaDescById(this.pendencia.situacaoDocumentoId);
  }

  /**
   * Realiza as validações necessárias para inserção ou atualização do registro
   *
   * @param form
   */
  handleValidSubmission(form: NgForm): void {
    const numAnoProcessoSIPAD: string[] = this.pendencia.numeroAnoProcessoMask ? this.pendencia.numeroAnoProcessoMask.split('/') : [];
    this.pendencia.numeroProcesso = Number(numAnoProcessoSIPAD[0]);
    this.pendencia.anoCadastro = Number(numAnoProcessoSIPAD[1]);

    const existeDocPendente = this.pendencia.documentosPendentes.every(documento =>
      Boolean(documento.tipoDocumentoId));

    if (this.pendencia.id) {
      if (!this.pendencia.processo.requerente || !this.pendencia.processo.dataCadastro) {
        this.notificationService.notifyInfo('É necessário informar um processo válido do SIPAD.');
      }
      else if (this.pendencia.documentosPendentes.length === 0 || !existeDocPendente) {
        this.notificationService.notifyError('É necessário informar ao menos um documento para a pendência.');
      }
      else {
        this.pendenciaService.validarPendenciaEmAberto(this.pendencia).subscribe(
          response => {
            if (response) {
              this.notificationService.notifyError("Já existe pendência em aberto para o processo SIPAD informado.");
            }
          }, error => {
            throw error;
          });
      }
    } else {
      if (!this.pendencia.processo.requerente || !this.pendencia.processo.dataCadastro) {
        this.notificationService.notifyInfo('É necessário informar um processo válido do SIPAD.');
      }
      else if (this.pendencia.documentosPendentes.length === 0 || !existeDocPendente) {
        this.notificationService.notifyError('É necessário informar ao menos um documento para a pendência.');
      }
      else {
        this.pendenciaService.validarPendenciaEmAberto(this.pendencia).subscribe(
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
          this.router.navigate(['pendencia']);
        },
      });
    } else {
      this.router.navigate(['pendencia']);
    }
  }

  /**
   * Adiciona uma nova pendência no banco de dados.
   *
   *
   */
  addPendencia(): void {
    this.loading = true;
    const pessoaLogada: number = Number.parseInt(this.codPessoaLogada);
    this.pendenciaService.addPendencia(this.pendencia, this.anexosFiles, this.documentosFiles, pessoaLogada).subscribe(
      pendencia => {
        this.pendencia = pendencia;
        this.notificationService.notifySuccess('Salvo com sucesso!');
        this.loading = false;
        this.router.navigate(['pendencia']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }

  /**
   * Método que inicia a conclusão da avaliação da pendência.
   *
   */
  concluir(): void {
    this.loading = true;
    const todosDecididos = this.pendencia.documentosPendentes.every(documento =>
      Boolean(documento.documentoAceito));

    if (!todosDecididos) {
      this.confirmDialogService.confirm({
        message: 'Existem documentos não aceitos na pendência. Deseja criar uma nova pendência com esses documentos?',
        accept: () => {
          this.pendencia.novaPendencia = true;
          this.loading = false;
          this.concluirPendencia();
        }, reject: () => {
          this.pendencia.novaPendencia = false;
          this.loading = false;
          this.concluirPendencia();
        }
      });
    } else {
      this.pendencia.novaPendencia = false;
      this.loading = false;
      this.concluirPendencia();
    }
  }

  /**
   *  Termina o processamento da conclusão da Pendência.
   *
   */
  concluirPendencia(): void {
    this.loading = true;
    this.pendencia.documentosPendentes.forEach(
      documento => {
        documento.situacaoDocumentoSolicitadoId = documento.documentoAceito ? SituacaoDocumentoEnum.ACEITO : SituacaoDocumentoEnum.NAO_ACEITO;
        documento.dataValidacao = new Date();
        documento.pessoaValidacaoId = Number.parseInt(this.codPessoaLogada);
      })

    this.pendencia.situacaoDocumentoId = SituacaoPendenciaEnum.CONCLUIDO;
    const pessoaLogada: number = Number.parseInt(this.codPessoaLogada);
    this.pendenciaService.concluirPendencia(this.pendencia, this.anexosFiles, this.documentosFiles, pessoaLogada).subscribe(
      pendencia => {
        this.pendencia = pendencia.body;
        this.pendencia.situacaoDocumentoDescricao = getSituacaoPendenciaDescById(this.pendencia.situacaoDocumentoId);
        this.loading = false;
        this.notificationService.notifySuccess('Salvo com sucesso!');
        this.router.navigate(['pendencia']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }



  /**
   * Método que responde a pendência.
   *
   */
  responder(): void {
    this.loading = true;
    this.pendencia.dataCiencia = new Date();
    this.pendencia.pessoaCienciaId = Number.parseInt(this.codPessoaLogada);
    const pessoaLogada = Number.parseInt(this.codPessoaLogada);

    const existeDocumentoArquitetonico = this.pendencia.documentosPendentes.find(
      documento => documento.tipoDocumentoId == 166
    );

    if (existeDocumentoArquitetonico != null || existeDocumentoArquitetonico != undefined) {
      this.pendenciaService.isUserArq(pessoaLogada).subscribe(
        response => {
          if (response) {
            const todosDocumentosAnexados = this.pendencia.documentosPendentes.every(
              documento => Boolean(documento.nomeArquivo)
            );
            if (!todosDocumentosAnexados) {
              this.notificationService.notifyError('Existem documentos pendentes sem arquivo de resposta, favor verificar.');
              this.loading = false;
            } else {
              const pessoa: number = Number.parseInt(this.codPessoaLogada);
              this.pendencia.situacaoDocumentoId = SituacaoPendenciaEnum.EM_ANALISE;
              this.pendencia.documentosPendentes.forEach(
                documento => {
                  documento.situacaoDocumentoSolicitadoId = SituacaoDocumentoEnum.NAO_ACEITO;
                  documento.dataAnexacao = new Date();
                  documento.pessoaAnexacaoId = Number.parseInt(this.codPessoaLogada);
                });

              this.pendenciaService.responderPendencia(this.pendencia, this.anexosFiles, this.documentosFiles, pessoa).subscribe(
                pendencia => {
                  //this.pendencia = pendencia.body;
                  //this.pendencia.situacaoDocumentoDescricao = getSituacaoPendenciaDescById(this.pendencia.situacaoDocumentoId);
                  this.loading = false;
                  this.notificationService.notifySuccess('Salvo com sucesso!');
                  this.router.navigate(['processo']);
                }, error => {
                  this.loading = false;
                  throw error;
                }
              );
            }
          } else {
            this.notificationService.notifyError('Somente usuários com CREA ou CAU podem responder pendências que solicitam projetos arquitetônicos.');
            this.loading = false;
          }
        }, error => {
          this.loading = false;
          throw error;
        }
      )
    } else {
      const todosDocumentosAnexados = this.pendencia.documentosPendentes.every(
        documento => Boolean(documento.nomeArquivo)
      );

      if (!todosDocumentosAnexados) {
        this.notificationService.notifyError('Existem documentos pendentes sem arquivo de resposta, favor verificar.');
        this.loading = false;
      } else {
        const pessoa: number = Number.parseInt(this.codPessoaLogada);
        this.pendencia.situacaoDocumentoId = SituacaoPendenciaEnum.EM_ANALISE;
        this.pendencia.documentosPendentes.forEach(
          documento => {
            documento.situacaoDocumentoSolicitadoId = SituacaoDocumentoEnum.NAO_ACEITO;
            documento.dataAnexacao = new Date();
            documento.pessoaAnexacaoId = Number.parseInt(this.codPessoaLogada);
          });

        this.pendenciaService.responderPendencia(this.pendencia, this.anexosFiles, this.documentosFiles, pessoa).subscribe(
          pendencia => {
            //this.pendencia = pendencia.body;
            //this.pendencia.situacaoDocumentoDescricao = getSituacaoPendenciaDescById(this.pendencia.situacaoDocumentoId);
            this.loading = false;
            this.notificationService.notifySuccess('Salvo com sucesso!');
            this.router.navigate(['processo']);
          }, error => {
            this.loading = false;
            throw error;
          }
        );
      }
    }
  }

  /**
   * Salva o rascunho da avaliação da pendência.
   *
   */
  salvarRascunho(): void {
    this.loading = true;
    this.pendencia.documentosPendentes.forEach(
      documento => {
        documento.situacaoDocumentoSolicitadoId = documento.documentoAceito ? SituacaoDocumentoEnum.ACEITO : SituacaoDocumentoEnum.NAO_ACEITO;
      })

    this.pendenciaService.salvarRascunhoPendencia(this.pendencia, this.anexosFiles, this.documentosFiles).subscribe(
      pendencia => {
        this.pendencia = pendencia.body;
        this.pendencia.situacaoDocumentoDescricao = getSituacaoPendenciaDescById(this.pendencia.situacaoDocumentoId);
        this.loading = false;
        this.notificationService.notifySuccess('Salvo com sucesso!');
        this.router.navigate(['pendencia']);
      }, error => {
        this.loading = false;
        throw error;
      }
    );
  }

}


