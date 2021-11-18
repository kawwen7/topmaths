import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  reference: string
  titre: string
  niveaux: Niveau[]
  pageExiste: boolean
}

interface QuestionFlash {
  reference: string
  titre: string
  slug: string
  pageExiste: boolean
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
  lienQuestionsFlash: string
  lienEval: string
  lienCours: string
  lienResume: string
  lienMission: string
  lienAnki: string
  presenceCalculMental: boolean
  messagePasDeCalculMental: string

  constructor(public http: HttpClient, private route: ActivatedRoute) {
    this.reference = ''
    this.numero = 0
    this.titre = ''
    this.objectifs = []
    this.calculsMentaux = []
    this.questionsFlash = []
    this.lienQuestionsFlash = ''
    this.lienEval = ''
    this.lienCours = ''
    this.lienResume = ''
    this.lienMission = ''
    this.lienAnki = ''
    this.presenceCalculMental = true
    this.messagePasDeCalculMental = ''
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
   observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      this.reference = params.ref
      this.modificationDesAttributs()
    })
  }

  /**
   * Ouvre sequences.json,
   * cherche la séquence qui a pour référence this.reference,
   * une fois trouvé, lance this.recupereAttributsSequence(sequence)
   */
  modificationDesAttributs() {
    this.http.get('assets/data/sequences.json').subscribe((data: any) => {
      data.find((niveau: any) => {
        return niveau.sequences.find((sequence: any) => {
          if (sequence.reference == this.reference) {
            this.recupereAttributsSequence(niveau, sequence)
          }
          return sequence.reference == this.reference;
        })
      })
    })
  }

  /**
   * Copie tous les sequence.attribut dans les this.attribut après les avoir retravaillés
   * @param niveau 
   * @param sequence 
   */
  recupereAttributsSequence(niveau: any, sequence: any) {
    this.numero = niveau.sequences.findIndex((sequence: any) => { return sequence.reference == this.reference; }) + 1
    this.titre = `Séquence ${this.numero} :<br>${sequence.titre}`
    this.recupereObjectifsSequence(sequence)
    this.recupereQuestionsFlash(sequence)
    this.recupereCalculsMentaux(sequence)
    this.recupereDetailsObjectifs()
    this.lienCours = this.creerLienTelechargement('cours')
    this.lienResume = this.creerLienTelechargement('resume')
    this.lienMission = this.creerLienTelechargement('mission')
    this.lienAnki = this.creerLienTelechargement('anki')
  }

  /**
   * Récupère les références des objectifs de la séquence,
   * les push à this.objectifs
   * @param sequence 
   */
  recupereObjectifsSequence(sequence: any) {
    this.objectifs = []
    for (const objectif of sequence.objectifs) {
      if (objectif.reference != '') {
        this.objectifs.push({
          reference: objectif.reference,
          slugs: []
        })
      }
    }
  }
  /**
   * Ouvre le json des objectifs,
   * cherche les différents objectifs pour récupérer leur titre (pour l'afficher) ainsi que leurs slugs (pour s'entraîner pour l'évaluation),
   * crée le lien pour s'entraîner pour l'évaluation.
   * Modifie les this.objectifs.titre, les this.objectifs.slugs et le this.lienEval
   */
  recupereDetailsObjectifs() {
    this.http.get('assets/data/objectifs.json').subscribe(
      (data: any) => {
        for (const niveau of data) {
          for (const theme of niveau.themes) {
            for (const sousTheme of theme.sousThemes) {
              for (const JSONobjectif of sousTheme.objectifs) {
                //On complète le titre et les slugs des objectifs de la séquence
                for (const thisObjectif of this.objectifs) {
                  if (thisObjectif.reference == JSONobjectif.reference) {
                    thisObjectif.titre = JSONobjectif.titre
                    for (const exercice of JSONobjectif.exercices) {
                      thisObjectif.slugs.push(exercice.slug)
                    }
                  }
                }
                // On vérifie si la page existe pour les objectifs des questions flash
                // On en profite pour créer le lien pour s'entraîner aux questions flash
                this.lienQuestionsFlash = 'https://coopmaths.fr/mathalea.html?'
                for (const questionFlash of this.questionsFlash) {
                  if (questionFlash.slug != '') {
                    this.lienQuestionsFlash = this.lienQuestionsFlash.concat('ex=', questionFlash.slug, '&')
                  }
                  if (questionFlash.reference == JSONobjectif.reference) {
                    questionFlash.pageExiste = true
                  }
                }
                this.lienQuestionsFlash = this.lienQuestionsFlash.concat('v=e')
                // On vérifie si la page existe pour les objectifs des calculs mentaux
                for (const calculMental of this.calculsMentaux) {
                  if (calculMental.reference == JSONobjectif.reference) {
                    calculMental.pageExiste = true
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
            if (slug.slice(0, 4) != 'http' && slug != '') {
              this.lienEval = this.lienEval.concat('ex=', slug, '&')
            }
          }
        }
        this.lienEval = this.lienEval.concat('v=e')
      }
    )
  }

  /**
   * Récupère les calculs mentaux de la séquence,
   * les push à this.calculsMentaux
   * @param sequence 
   */
  recupereCalculsMentaux(sequence: any) {
    this.calculsMentaux = []
    for (const calculMental of sequence.calculsMentaux) {
      let niveauxTemp = []
      for (const niveau of calculMental.niveaux) {
        niveauxTemp.push({
          commentaire: niveau.commentaire,
          lien: niveau.lien
        })
      }
      this.calculsMentaux.push({
        reference: calculMental.reference,
        titre: calculMental.titre,
        niveaux: niveauxTemp,
        pageExiste: false
      })
    }
    if (this.calculsMentaux[0].reference == '') {
      this.presenceCalculMental = false
      this.messagePasDeCalculMental = this.calculsMentaux[0].niveaux[0].commentaire
    }
  }

  /**
   * Récupère la liste des questions flash de la séquence,
   * les push à this.questionsFlash
   * @param sequence 
   */
  recupereQuestionsFlash(sequence: any) {
    this.questionsFlash = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    for (const questionFlash of sequence.questionsFlash) {
      if (questionFlash.objectif != '') {
        this.questionsFlash.push({
          reference: questionFlash.reference,
          titre: questionFlash.titre,
          slug: questionFlash.slug,
          pageExiste: false
        })
      }
    }
  }

  /**
   * Donne l'écriture en lettres d'un nombre
   * @param nombre 
   * @returns string
   */
  nombreObjectifs(nombre: number) {
    switch (nombre) {
      case 1:
        return 'un objectif'

      case 2:
        return 'deux objectifs'

      case 3:
        return 'trois objectifs'

      case 4:
        return 'quatre objectifs'

      case 5:
        return 'cinq objectifs'

      case 6:
        return 'six objectifs'

      default:
        return ''
    }
  }

  /**
   * Vérifie si le fichier assets/type/niveau/Type_reference.extension existe et renvoie le lien si c'est le cas
   * @param type peut être cours, resume, mission ou anki
   * le niveau peut être 6e, 5e, 4e ou 3e
   * la référence correspond à this.reference
   * l'extension est apkg si le type est anki, pdf sinon
   * @returns lien de téléchargement du fichier s'il existe, une chaîne vide sinon
   */
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

  /**
   * Copie dans le presse-papier le lien vers un certain niveau d'un calcul mental
   * @param niveau 
   */
  copierLien(niveau: any) {
    if (typeof (niveau.lien) != 'undefined') {
      navigator.clipboard.writeText(niveau.lien);
      alert('Le lien vers l\'exercice a été copié')
    }
  }

  /**
   * Vérifie si un fichier existe ou pas
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
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
