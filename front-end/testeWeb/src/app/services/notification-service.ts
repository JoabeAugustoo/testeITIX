import { Injectable } from '@angular/core';
import { Notification } from '../models/notification.model';
import { Subject, Observable } from 'rxjs';
import { NotificationType } from '../models/enums/notification-type.enum';

/**
 * Serviço de notificações do sistema.
 */
@Injectable()
export class NotificationService {

  private notifier = new Subject<Notification>();

  /**
   * Exibe uma notificação no sistema.
   *
   * @param message texto da mensagem a ser exibida
   * @param type tipo da mensagem a ser exibida
   * @param time tempo que a mensagem deve ser exibida na tela até que seja fechada automaticamente
   */
  notify(message: any, type: NotificationType, time?: number): void {
    this.notifier.next(new Notification(message, type, time));
  }

  /**
   * Exibe uma notificação de sucesso no sistema.
   *
   * @param message texto da mensagem a ser exibida
   * @param time tempo que a mensagem deve ser exibida na tela até que seja fechada automaticamente
   */
  notifySuccess(message: any, time?: number): void {
    this.notify(message, NotificationType.success, time);
  }

  /**
   * Exibe uma notificação de erro no sistema.
   *
   * @param message texto da mensagem a ser exibida
   * @param time tempo que a mensagem deve ser exibida na tela até que seja fechada automaticamente
   */
  notifyError(message: any, time?: number): void {
    this.notify(message, NotificationType.error, time);
  }

  /**
   * Exibe uma notificação de alerta no sistema.
   *
   * @param message texto da mensagem a ser exibida
   * @param time tempo que a mensagem deve ser exibida na tela até que seja fechada automaticamente
   */
  notifyWarning(message: any, time?: number): void {
    this.notify(message, NotificationType.warning, time);
  }

  /**
   * Exibe uma notificação de informação no sistema.
   *
   * @param message texto da mensagem a ser exibida
   * @param time tempo que a mensagem deve ser exibida na tela até que seja fechada automaticamente
   */
  notifyInfo(message: any, time?: number): void {
    this.notify(message, NotificationType.info, time);
  }

  /**
   * Recupera o Observable que coordena as mensagens enviadas no sistema.
   *
   * @return um Observable que avisa aos subscribers sempre que uma nova notificação é enviada no sistema
   */
  listen(): Observable<Notification> {
    return this.notifier.asObservable();
  }
}
