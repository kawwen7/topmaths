import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SafePipe } from './services/safe.pipe';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SequenceComponent } from './sequence/sequence.component';
import { JeuxComponent } from './jeux/jeux.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { WhosonlineComponent } from './whosonline/whosonline.component';
import { ClassementComponent } from './classement/classement.component';
import { NgParticlesModule } from "ng-particles";
import { MathjaxModule } from 'mathjax-angular';
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component';
import { TropheesComponent } from './trophees/trophees.component';

@NgModule({
  declarations: [
    AppComponent,
    ObjectifComponent,
    AccueilComponent,
    SafePipe,
    ObjectifsComponent,
    SequencesComponent,
    SequenceComponent,
    JeuxComponent,
    LoginComponent,
    ProfilComponent,
    WhosonlineComponent,
    ClassementComponent,
    SPS1Component,
    TropheesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    NgParticlesModule,
    MathjaxModule.forRoot({
      "config": {
        "loader": {
          "load": ["output/svg", "[tex]/require", "[tex]/ams"]
        },
        "tex": {
          "inlineMath": [["$", "$"]],
          "packages": ["base", "require", "ams"]
        },
        "svg": { "fontCache": "global" }
      },
      "src": "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js"
    }),
    MathjaxModule.forChild()
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
