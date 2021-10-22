import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
            for (const objectif of sequence.objectifs) {
              if (objectif.reference != '') {
                this.objectifs.push({
                  reference: objectif.reference,
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
                // On crée le lien pour s'entraîner pour l'évaluation
                this.lienEval = 'https://coopmaths.fr/mathalea.html?'
                for (const thisObjectif of this.objectifs) {
                  for (const slug of thisObjectif.slugs) {
                    this.lienEval = this.lienEval.concat('ex=', slug, '&')
                  }
                }
                this.lienEval = this.lienEval.concat('v=e')
              }
            )
            this.calculsMentaux = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
            for (const calculMental of sequence.calculsMentaux) {
              let niveauxTemp = []
              for (const niveau of calculMental.niveaux) {
                niveauxTemp.push({
                  commentaire: niveau.commentaire,
                  lien: niveau.lien
                })
              }
              this.calculsMentaux.push({
                objectif: calculMental.objectif,
                niveaux: niveauxTemp
              }
              )
            }
            this.questionsFlash = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
            for (const questionFlash of sequence.questionsFlash) {
              if (questionFlash.objectif != '') {
                this.questionsFlash.push({
                  objectif: questionFlash.objectif,
                  lien: questionFlash.lien
                })
              }
            }
            this.lienCours = this.creerLienTelechargement('cours')
            this.lienResume = this.creerLienTelechargement('resume')
            this.lienMission = this.creerLienTelechargement('mission')
            this.lienAnki = this.creerLienTelechargement('anki')
          }
          return sequence.reference == this.reference;
        })
      })
    })
  }
  nombreEnLettres(nombre: number) {
    switch (nombre) {
      case 1:
        return 'un'

      case 2:
        return 'deux'

      case 3:
        return 'trois'

      case 4:
        return 'quatre'

      case 5:
        return 'cinq'

      case 6:
        return 'six'

      default:
        return '?'
    }
  }
  creerLienTelechargement(type: string) {
    let extension: string
    if (type == 'anki') {
      extension = 'apkg'
    } else {
      extension = 'pdf'
    }
    let lien = `assets/${type}/${this.reference.slice(1, 2)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${this.reference}.${extension}`
    if (!this.doesFileExist(lien)) {
      lien = ''
    }
    return lien
  }
  doesFileExist(urlToFile: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == 404) {
      return false;
    } else {
      return true;
    }
  }
}
