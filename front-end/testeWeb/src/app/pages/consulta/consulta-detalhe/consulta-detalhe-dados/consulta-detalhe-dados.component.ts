import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService, Combobox } from 'pmv-common';
import { Consulta } from 'src/app/models/consulta.model';
import { ConsultaService } from 'src/app/services/consulta-service';
import { ActivatedRoute } from '@angular/router';

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

  }

}
