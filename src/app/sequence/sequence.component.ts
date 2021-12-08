import { sequence } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConfettiService } from '../services/confetti.service';
import { CalculMental, Niveau, NiveauCM, Objectif, QuestionFlash, Sequence } from '../services/sequences';
import { Niveau as NiveauObjectif } from '../services/objectifs';


@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['../../assets/css/bulma.css']
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
  derniereUrl: string
  derniereGraine: string
  dernierSlider: number
  messageScore: string
  dateDerniereReponse: Date

  constructor(public http: HttpClient, private route: ActivatedRoute, private dataService: ApiService, public confetti: ConfettiService) {
    this.reference = ''
    this.numero = 0
    this.titre = ''
    this.objectifs = []
    this.calculsMentaux = [new CalculMental('', '', [new NiveauCM('', '', '', '', '', false, 0)], false)]
    this.questionsFlash = []
    this.lienQuestionsFlash = ''
    this.lienEval = ''
    this.lienCours = ''
    this.lienResume = ''
    this.lienMission = ''
    this.lienAnki = ''
    this.presenceCalculMental = true
    this.messagePasDeCalculMental = ''
    this.derniereUrl = ''
    this.derniereGraine = ''
    this.dernierSlider = 0
    this.messageScore = ''
    this.dateDerniereReponse = new Date()
    setTimeout(() => this.confetti.stop(), 3000) // Sinon un reliquat reste apparent
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    this.ecouteMessagesPost()
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
   * Ecoute les messages Post pour récupérer l'url et modifier le lien à copier des exercices
   */
  ecouteMessagesPost() {
    window.addEventListener('message', (event) => {
      const dateNouvelleReponse = new Date()
      if (dateNouvelleReponse.getTime() - this.dateDerniereReponse.getTime() > 200) {
        const url: string = event.data.url;
        if (typeof (url) != 'undefined') {
          // On cherche à quel exercice correspond ce message
          for (const calculMental of this.calculsMentaux) {
            for (const niveau of calculMental.niveaux) {
              if (typeof (niveau.lien) != 'undefined') {
                if (url == niveau.lien) {
                  // On a trouvé à quel exercice correspond ce message
                  const nbBonnesReponses: number = event.data.nbBonnesReponses
                  const nbMauvaisesReponses: number = event.data.nbMauvaisesReponses
                  const slider: number = event.data.slider
                  if (typeof (slider) != 'undefined') {
                    // On s'assure que les exercices soient différents pour ne pas ajouter plusieurs fois du score
                    if (this.derniereUrl != niveau.lien || this.derniereGraine != niveau.graine || this.dernierSlider != niveau.slider) {
                      this.derniereUrl = niveau.lien
                      if (typeof (niveau.graine) != 'undefined') this.derniereGraine = niveau.graine
                      if (typeof (niveau.slider) != 'undefined') this.dernierSlider = niveau.slider
                      const majScore: string = (parseInt(niveau.score) * nbBonnesReponses).toString()
                      if (parseInt(majScore) > 0) {
                        this.dataService.majScore(majScore, niveau.lien)
                        this.messageScore = '+ ' + majScore
                        niveau.bonneReponse = true
                        setTimeout(() => niveau.bonneReponse = false, 2000)
                        if (nbMauvaisesReponses == 0) {
                          this.confetti.lanceConfetti()
                        }
                      }
                    }
                  }
                  niveau.graine = event.data.graine
                  niveau.lienACopier = `${url.split(',a=')[0]},a=${niveau.graine}${url.split(',a=')[1]}`
                }
              }
            }
          }
        }
      }
    })
  }

  /**
   * Ouvre sequences.json,
   * cherche la séquence qui a pour référence this.reference,
   * une fois trouvé, lance this.recupereAttributsSequence(sequence)
   */
  modificationDesAttributs() {
    this.http.get<Niveau[]>('assets/data/sequences.json').subscribe(niveaux => {
      niveaux.find(niveau => {
        return niveau.sequences.find(sequence => {
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
  recupereAttributsSequence(niveau: Niveau, sequence: Sequence) {
    this.numero = niveau.sequences.findIndex(sequence => { return sequence.reference == this.reference; }) + 1
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
  recupereObjectifsSequence(sequence: Sequence) {
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
    this.http.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
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
  recupereCalculsMentaux(sequence: Sequence) {
    this.calculsMentaux = []
    for (const calculMental of sequence.calculsMentaux) {
      let niveauxTemp = []
      for (const niveau of calculMental.niveaux) {
        niveauxTemp.push({
          commentaire: niveau.commentaire,
          lien: niveau.lien + '&embed=https://topmaths.fr',
          score: niveau.score,
          lienACopier: niveau.lien
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
  recupereQuestionsFlash(sequence: Sequence) {
    this.questionsFlash = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    for (const questionFlash of sequence.questionsFlash) {
      if (questionFlash.reference != '') {
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
    this.verifieExistence(type, lien)
    return lien
  }

  /**
   * Copie dans le presse-papier le lien vers un certain niveau d'un calcul mental
   * @param niveau 
   */
  copierLien(niveau: NiveauCM) {
    if (typeof (niveau.lienACopier) != 'undefined') {
      navigator.clipboard.writeText(niveau.lienACopier);
      alert('Le lien vers l\'exercice a été copié')
    }
  }

  /**
   * Vérifie si un fichier existe ou pas
   * S'il existe, on modifie le innerHTML du div concerné et on affiche le div des téléchargements
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
  verifieExistence(type: string, urlToFile: string) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let divId = '', description
        switch (type) {
          case 'cours':
            divId = 'lienCours'
            description = 'le cours'
            break
          case 'resume':
            divId = 'lienResume'
            description = 'le résumé'
            break
          case 'mission':
            divId = 'lienMission'
            description = 'la mission'
            break
          case 'anki':
            divId = 'lienAnki'
            description = 'le paquet Anki de la séquence'
            break
        }
        const div = document.getElementById(divId)
        if (div != null) div.innerHTML = `<a href=${urlToFile}>Télécharger ${description}</a>`
        const telechargements = document.getElementById('telechargements')
        if (telechargements != null) telechargements.style.display = 'block'
      }
    };
    xhttp.open("HEAD", urlToFile, true);
    xhttp.send();
  }
}
