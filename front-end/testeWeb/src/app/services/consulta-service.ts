import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consulta } from '../models/consulta.model';
import { RetornoConsultasDTO } from '../models/DTO/retorno-consultas.dto';
import { ResultGetPaged } from '../models/result-get-paged.model';
import { filterBy } from '../utils/filter-by-function';
import { pageWith } from '../utils/page-function';
import { Observable } from 'rxjs';

@Injectable()
export class ConsultaService {

  constructor(
    private httpClient: HttpClient,
  ) { }


  /**
   * Recupera a consulta buscando pelo id.
   *
   * @return Um Observable contendo uma lista de autos
   */
  getConsultaById(id: number): Observable<Consulta> {
    return this.httpClient.get<Consulta>(`Consulta/ConsultarConsulta/${id}`);
  }

  /**
   * Recupera todas as consultas do sistema.
   *
   * @return Um Observable contendo uma lista de autos
   */
  getConsultasByFilter(page: number, items: number, filter?: any, sort?: string, sortOrder?: number): Observable<ResultGetPaged<RetornoConsultasDTO>> {
    let url: string = pageWith(page, items, filterBy(filter, `Consulta/PesquisarConsultas?sort=${sort}&sortOrder=${sortOrder}`));
    return this.httpClient.get<ResultGetPaged<RetornoConsultasDTO>>(url);
  }

  /**
   *
   * Adiciona uma nova consulta.
   * @param consulta
   */
  addConsulta(consulta: Consulta): Observable<any> {
    return this.httpClient.post<any>(`Consulta/AddConsulta`, {
      observe: 'response', headers: new HttpHeaders().set('Content-Type', '')
    });
  }

  /**
   *
   * Atualiza a consulta selecionada.
   * @param consulta
   */
  updateConsulta(consulta: Consulta): Observable<any> {
    return this.httpClient.put<any>(`Consulta/UpdateConsulta/${consulta.id}`, {
      observe: 'response', headers: new HttpHeaders().set('Content-Type', '')
    });
  }

  excluirConsulta(consulta: Consulta): Observable<any> {
    return this.httpClient.delete<any>(`Consulta/RemoveConsulta/${consulta.id}`, {
      observe: 'response', headers: new HttpHeaders().set('Content-Type', '')
    });
  }

}
