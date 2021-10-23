import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SequenceComponent } from './sequence/sequence.component';
import { JeuxComponent } from './jeux/jeux.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'objectif/:ref', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sousTheme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: 'sequences/:niveau', component: SequencesComponent },
  { path: 'sequences', redirectTo: 'sequences/tout' },
  { path: 'sequence/:ref', component: SequenceComponent },
  { path: 'jeux', component: JeuxComponent },
  { path: '', component: AccueilComponent },
  { path: ':ref', component: ObjectifComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
