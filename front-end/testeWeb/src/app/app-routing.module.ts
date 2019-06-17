import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '', children: [
      { path: 'consulta', loadChildren: 'app/pages/pendencia/pendencia.module#PendenciaModule' },
      { path: '**', redirectTo: 'consulta', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
