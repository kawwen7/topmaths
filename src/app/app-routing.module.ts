import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'objectif/:ref', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sous_theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: ':ref', component: ObjectifComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
