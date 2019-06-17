import { NotificationType } from './enums/notification-type.enum';

export class Notification {
  public cssClass: string;
  public icon: string;
  public srOnlyText: string;

  constructor(
    public message: string,
    public type: NotificationType,
    public time: number,
  ) {
    this.cssClass = `alert-${NotificationType[type]}`;
    switch (type) {
      case NotificationType.success:
        this.icon = 'glyphicon glyphicon-ok-sign';
        this.srOnlyText = 'Sucesso:';
        this.cssClass = 'alert-success';
        break;
      case NotificationType.error:
        this.icon = 'glyphicon glyphicon-remove-sign';
        this.srOnlyText = 'Erro:';
        this.cssClass = 'alert-danger';
        break;
      case NotificationType.warning:
        this.icon = 'glyphicon glyphicon-exclamation-sign';
        this.srOnlyText = 'Atenção:';
        this.cssClass = 'alert-warning';
        break;
      case NotificationType.info:
        this.icon = 'glyphicon glyphicon-info-sign';
        this.srOnlyText = 'Aviso:';
        this.cssClass = 'alert-info';
        break;
    }
  }
}
