import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'objectif', component: ObjectifComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
