import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormType } from 'src/app/models/enums/form-type.enum';

/**
 * Classe que define o comportamento padrão de uma tela de detalhes. As telas de detalhes dos sistemas contém
 * informações relacionadas aos formulários das telas e dados que indicam o tipo de exibição do formulário.
 */
export abstract class DetailComponent {

  protected formType: FormType;

  constructor(
    activatedRoute: ActivatedRoute,
  ) {
    this.setupFormType(activatedRoute);
  }

  /**
   * Determina o tipo do formulário através dos dados passados na rota ativa.
   *
   * @param activatedRoute dados da rota ativa
   */
  protected setupFormType(activatedRoute: ActivatedRoute) {
    if (activatedRoute) {
      this.formType = activatedRoute.snapshot.data.formType;
    }
    if (!this.formType) {
      console.warn('Tipo de formulário não foi definido para o componente!');
    }
  }

  /**
   * Determina se o formulário é do tipo de criação de dados.
   *
   * @return true se o formulário for do tipo de criação e false caso contrário
   */
  get isFormTypeCreate(): boolean {
    return this.formType === FormType.create;
  }

  /**
   * Determina se o formulário é do tipo de edição de dados.
   *
   * @return true se o formulário for do tipo de edição e false caso contrário
   */
  get isFormTypeUpdate(): boolean {
    return this.formType === FormType.update;
  }

  /**
   * Determina se o formulário é do tipo de visualização de dados.
   *
   * @return true se o formulário for do tipo de visualização e false caso contrário
   */
  get isFormTypeView(): boolean {
    return this.formType === FormType.view;
  }

  /**
   * Método listener do evento de submissão do formulário da tela. Normalmente é acessado via HTML fazendo o bind do
   * evento submit de um elemento <form> e passando a variável de template associada ao ngForm do formulário. Exemplo de
   * uso:
   *     <form #form="ngForm" (submit)="onSubmit(form)">
   *
   * @param form instância do NgForm associada ao formulário que está sendo submetido
   */
  onSubmit(form: NgForm) {
    if (form && form instanceof NgForm) {
      if (form.valid) {
        this.handleValidSubmission(form);
      } else {
        this.handleInvalidSubmission(form);
      }
    } else {
      console.warn(
        '\n'
        + 'Por favor, passe uma instância de NgForm para o método de submissão do formulário.\n'
        + 'Exemplo de uso:\n'
        + '    <form #form="ngForm" (submit)="onSubmit(form)">\n'
      );
    }
  }

  /**
   * Faz o tratamento de uma submissão válida do formulário.
   *
   * @param form instância do NgForm associada ao formulário que está sendo submetido
   */
  abstract handleValidSubmission(form: NgForm): void;

  /**
   * Faz o tratamento de uma submissão inválida do formulário.
   *
   * @param form instância do NgForm associada ao formulário que está sendo submetido
   */
  handleInvalidSubmission(form: NgForm): void {
    // implementação padrão vazia
  }
}
