import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

/**
 * Dados de configuração do sistema.
 */
@Injectable()
export class AppConfig {

  title: string = "Teste ITIX";
  readonly version: string = '1.0.0';

}
