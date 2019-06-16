import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PMVAuthenticationGuard, PMVAuthorizationGuard } from 'pmv-common';

import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '', canActivateChild: [PMVAuthenticationGuard, PMVAuthorizationGuard], children: [

      { path: 'home', component: HomeComponent },
      { path: 'processo', loadChildren: 'app/pages/processo/processo.module#ProcessoModule' },
      { path: 'pendencia', loadChildren: 'app/pages/pendencia/pendencia.module#PendenciaModule' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
