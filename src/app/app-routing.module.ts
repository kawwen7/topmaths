import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SequenceComponent } from './sequence/sequence.component';
import { JeuxComponent } from './jeux/jeux.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthguardGuard } from './services/auth.guard';
import { ClassementComponent } from './classement/classement.component';
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component';
import { TropheesComponent } from './trophees/trophees.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'objectif/:ref', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sousTheme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: 'sequences/:niveau', component: SequencesComponent },
  { path: 'sequences', redirectTo: 'sequences/tout' },
  { path: 'sequence/SPS1', component: SPS1Component },
  { path: 'sequence/:ref', component: SequenceComponent },
  { path: 'trophees/:ref', component: TropheesComponent },
  { path: 'jeux', component: JeuxComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthguardGuard] },
  { path: 'classement', component: ClassementComponent },
  { path: '', component: AccueilComponent },
  { path: ':ref', component: ObjectifComponent },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
