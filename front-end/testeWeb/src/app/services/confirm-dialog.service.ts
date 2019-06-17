import { Injectable } from '@angular/core';
import { Confirmation as PrimeNgConfirmation, ConfirmationService } from 'primeng/primeng';

export interface Confirmation extends PrimeNgConfirmation { }

/**
 * Serviço para chamada da caixa de diálogo de confirmação do sistema.
 */
@Injectable()
export class ConfirmDialogService {
  constructor(
    private confirmationService: ConfirmationService,
  ) { }

  /**
   * Exibe a caixa de confirmação do sistema.
   *
   * @param confirmation parâmetros para exibição da caixa de confirmação
   */
  confirm(confirmation: Confirmation): void {
    this.confirmationService.confirm(confirmation);
  }
}
