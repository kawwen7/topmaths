import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import { existsSync } from 'fs';

interface Objectif {
  reference: string
  titre?: string
  slugs: string[]
}

interface Niveau {
  commentaire: string
  lien: string
}

interface CalculMental {
  objectif: string
  niveaux: Niveau[]
}

interface QuestionFlash {
  objectif: string
  lien: string
}

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class SequenceComponent implements OnInit {
  reference: string
  numero: number
  titre: string
  objectifs: Objectif[]
  calculsMentaux: CalculMental[]
  questionsFlash: QuestionFlash[]
  lienEval: string
  lienCours: string
  lienResume: string
  lienMission: string
  lienAnki: string

  constructor(public http: HttpClient, private route: ActivatedRoute) {
    this.reference = ''
    this.numero = 0
    this.titre = ''
    this.objectifs = []
    this.calculsMentaux = []
    this.questionsFlash = []
    this.lienEval = ''
    this.lienCours = ''
    this.lienResume = ''
    this.lienMission = ''
    this.lienAnki = ''
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reference = params.ref
    })
    this.http.get('assets/data/sequences.json').subscribe((data: any) => {
      // On cherche dans le json des séquences la bonne référence
      data.find((niveau: any) => {
        return niveau.sequences.find((sequence: any) => {
          // Une fois qu'on l'a trouvée, on modifie les attributs
          if (sequence.reference == this.reference) {
            this.numero = niveau.sequences.findIndex((sequence: any) => { return sequence.reference == this.reference; }) + 1
            this.titre = `Séquence ${this.numero} :<br>${sequence.titre}`
            this.objectifs = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
            for (let i = 0; i < sequence.objectifs.length; i++) {
              if (sequence.objectifs[i].reference != '') {
                this.objectifs.push({
                  reference: sequence.objectifs[i].reference,
                  slugs: []
                })
              }
            }
            // On cherche dans le json des objectifs les différents objectifs pour récupérer leur titre (pour l'afficher) ainsi que leurs slugs (pour s'entraîner pour l'évaluation)
            this.http.get('assets/data/objectifs.json').subscribe(
              (data: any) => {
                for (const niveau of data) {
                  for (const theme of niveau.themes) {
                    for (const sousTheme of theme.sousThemes) {
                      for (const JSONobjectif of sousTheme.objectifs) {
                        for (const thisObjectif of this.objectifs) {
                          if (thisObjectif.reference == JSONobjectif.reference) { // On a trouvé la bonne référence
                            // On complète le titre et les slugs des exercices
                            thisObjectif.titre = JSONobjectif.titre
                            for (const exercice of JSONobjectif.exercices) {
                              thisObjectif.slugs.push(exercice.slug)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            )
            // On crée le lien pour s'entraîner pour l'évaluation
            this.lienEval = 'https://coopmaths.fr/mathalea.html?'
            for (const objectif of this.objectifs) {
              console.log(objectif.slugs)
              console.log(objectif.slugs.length)
              for (let j = 0; j < objectif.slugs.length; j++) {
                this.lienEval = this.lienEval.concat(this.lienEval,'ex=',objectif.slugs[j],'&')
              }
            }
            this.lienEval = this.lienEval.concat('v=e')
            this.calculsMentaux = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
            for (let i = 0; i < sequence.calculsMentaux.length; i++) {
              let niveauxTemp = []
              for (let j = 0; j < sequence.calculsMentaux[i].niveaux.length; j++) {
                niveauxTemp.push({
                  commentaire: sequence.calculsMentaux[i].niveaux[j].commentaire,
                  lien: sequence.calculsMentaux[i].niveaux[j].lien
                })
              }
              this.calculsMentaux.push({
                objectif: sequence.calculsMentaux[i].objectif,
                niveaux: niveauxTemp
              }
              )
            }
            this.questionsFlash = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
            for (let i = 0; i < sequence.questionsFlash.length; i++) {
              if (sequence.questionsFlash[i].objectif != '') {
                this.questionsFlash.push({
                  objectif: sequence.questionsFlash[i].objectif,
                  lien: sequence.questionsFlash[i].lien
                })
              }
            }
            this.lienCours = `../assets/cours/4e/Cours_${this.reference.slice(0)}.pdf`
            // if (!existsSync(this.lienCours)) {
            //   this.lienCours = ''
            // }
          }
          return sequence.reference == this.reference;
        })
      })
    })
  }
}
