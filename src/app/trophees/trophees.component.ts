import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-trophees',
  templateUrl: './trophees.component.html',
  styleUrls: ['./trophees.component.css']
})
export class TropheesComponent implements OnInit {
  codeTrophee: string
  totalEleves: number
  annee: string
  stats: any
  eleves: any
  eleve: any
  lignes: any[]
  modal: any
  modalChoix: any
  texteModale: string
  texteModaleChoix: string
  sujetEval: string
  peutDemanderRefaireEval: boolean

  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService) {
    this.codeTrophee = ''
    this.totalEleves = 0
    this.annee = ''
    this.lignes = []
    this.texteModale = ''
    this.texteModaleChoix = ''
    this.sujetEval = ''
    this.peutDemanderRefaireEval = false
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    this.modal = document.getElementById("modaleRefaireEvaluation")
    this.modalChoix = document.getElementById("modaleChoixCodeTrophee")
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      if (params.ref == 'autre') {
        this.codeTrophee = this.dataService.codeTropheesClique
        this.peutDemanderRefaireEval = false
      } else {
        this.codeTrophee = params.ref
        this.peutDemanderRefaireEval = true
      }
      this.modificationDesAttributs()
    })
  }

  /**
   * Cherche la référence dans les json de trophées de chaque niveau
   * Une fois la référence trouvée, lance la construction de la liste des trophées à afficher
   */
  modificationDesAttributs() {
    this.http.get('assets/data/trophees5e.json').subscribe((object: any) => {
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const eleve = object[key]
          if (eleve.reference == this.codeTrophee) {
            this.eleve = eleve
            this.eleves = object
            this.annee = '5ème'
            this.recupereTrophees5e()
            return eleve
          }
        }
      }
    })
    this.http.get('assets/data/trophees4e.json').subscribe((object: any) => {
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const eleve = object[key]
          if (eleve.reference == this.codeTrophee) {
            this.eleve = eleve
            this.eleves = object
            this.annee = '4ème'
            this.recupereTrophees4e()
            return eleve
          }
        }
      }
    })
  }

  /**
   * Construit la liste de trophées à afficher
   */
  recupereTrophees5e() {
    const ligne1 = [
      [
        this.trophee('5e', 'nombreDeVerts', 'Obtenir son premier vert', 1),
        this.trophee('5e', 'nombreDeVerts', 'Obtenir un vert dans 5 compétences', 5),
        this.trophee('5e', 'nombreDeVerts', 'Obtenir un vert dans 10 compétences', 10)
      ], [
        this.trophee('5e', 'nombreDeVerts', 'Obtenir un vert dans 20 compétences', 20),
        this.trophee('5e', 'nombreDeVerts', 'Obtenir un vert dans 30 compétences', 30),
        this.trophee('5e', 'nombreDeVerts', 'Obtenir un vert dans 50 compétences', 50)
      ]
    ]
    const ligne2 = [
      [
        this.trophee('5e', 'calculs', 'Calculs', 1),
        this.trophee('5e', 'calculs', 'Calculs', 2),
        this.trophee('5e', 'calculs', 'Calculs', 4)
      ], [
        this.trophee('5e', 'arithmetique', 'Arithmétique', 1),
        this.trophee('5e', 'arithmetique', 'Arithmétique', 3),
        this.trophee('5e', 'arithmetique', 'Arithmétique', 5)
      ]
    ]
    const ligne3 = [
      [
        this.trophee('5e', 'fractions', 'Fractions', 1),
        this.trophee('5e', 'fractions', 'Fractions', 4),
        this.trophee('5e', 'fractions', 'Fractions', 7)
      ], [
        this.trophee('5e', 'nombresRelatifs', 'Nombres Relatifs', 1),
        this.trophee('5e', 'nombresRelatifs', 'Nombres Relatifs', 4),
        this.trophee('5e', 'nombresRelatifs', 'Nombres Relatifs', 7)
      ]
    ]
    const ligne4 = [
      [
        this.trophee('5e', 'calculLitteral', 'Calcul littéral', 1),
        this.trophee('5e', 'calculLitteral', 'Calcul littéral', 3),
        this.trophee('5e', 'calculLitteral', 'Calcul littéral', 6)
      ], [
        this.trophee('5e', 'proportionnalite', 'Proportionnalité', 1),
        this.trophee('5e', 'proportionnalite', 'Proportionnalité', 2),
        this.trophee('5e', 'proportionnalite', 'Proportionnalité', 4)
      ]
    ]
    const ligne5 = [
      [
        this.trophee('5e', 'statistiques', 'Statistiques', 1),
        this.trophee('5e', 'statistiques', 'Statistiques', 3),
        this.trophee('5e', 'statistiques', 'Statistiques', 5)
      ], [
        this.trophee('5e', 'symetries', 'Symétrie', 1),
        this.trophee('5e', 'symetries', 'Symétrie', 2),
        this.trophee('5e', 'symetries', 'Symétrie', 4)
      ]
    ]
    const ligne6 = [
      [
        this.trophee('5e', 'perimetreEtAire', 'Périmètre et aire', 1),
        this.trophee('5e', 'perimetreEtAire', 'Périmètre et aire', 2),
        this.trophee('5e', 'perimetreEtAire', 'Périmètre et aire', 4)
      ], [
        this.trophee('5e', 'volume', 'Volume', 1),
        this.trophee('5e', 'volume', 'Volume', 2),
        this.trophee('5e', 'volume', 'Volume', 4)
      ]
    ]
    const ligne7 = [
      [
        this.trophee('5e', 'triangles', 'Triangles', 1),
        this.trophee('5e', 'triangles', 'Triangles', 2),
        this.trophee('5e', 'triangles', 'Triangles', 4)
      ], [
        this.trophee('5e', 'parallelogrammes', 'Parallélogrammes', 1),
        this.trophee('5e', 'parallelogrammes', 'Parallélogrammes', 2),
        this.trophee('5e', 'parallelogrammes', 'Parallélogrammes', 3)
      ]
    ]
    const ligne8 = [
      [
        this.trophee('5e', 'espace', 'Espace', 1),
        this.trophee('5e', 'espace', 'Espace', 2),
        this.trophee('5e', 'espace', 'Espace', 4)
      ], [
        this.trophee('5e', 'presenterLeTravailDeSonGroupe', 'Présenter 1 fois le travail de son groupe', 1),
        this.trophee('5e', 'presenterLeTravailDeSonGroupe', 'Présenter 2 fois le travail de son groupe', 2),
        this.trophee('5e', 'presenterLeTravailDeSonGroupe', 'Présenter 3 fois le travail de son groupe', 3)
      ]
    ]
    const ligne9 = [
      [
        this.trophee('5e', 'obtenirSonBrevetDeTuteur', 'Obtenir son brevet de tuteur'),
        this.trophee('5e', 'maitriserScratch', 'Maîtriser Scratch'),
        this.trophee('5e', 'maitriserGeogebra', 'Maîtriser Geogebra')
      ], [
        this.trophee('5e', 'probabilites', 'Probabilités', 2),
        this.trophee('5e', 'fonctions', 'Fonctions', 2),
        this.trophee('5e', 'durees', 'Durées', 2)
      ]
    ]
    const ligne10 = [
      [
        this.trophee('5e', 'angles', 'Angles', 2),
        this.trophee('5e', 'faireUnExpose', 'Faire un exposé')
      ]
    ]
    this.lignes = [ligne1, ligne2, ligne3, ligne4, ligne5, ligne6, ligne7, ligne8, ligne9, ligne10]
    this.recupereStats()
  }

  /**
   * Construit la liste de trophées à afficher
   */
  recupereTrophees4e() {
    const ligne1 = [
      [
        this.trophee('4e', 'nombreDeVerts', 'Obtenir son premier vert', 1),
        this.trophee('4e', 'nombreDeVerts', 'Obtenir un vert dans 5 compétences', 5),
        this.trophee('4e', 'nombreDeVerts', 'Obtenir un vert dans 10 compétences', 10)
      ], [
        this.trophee('4e', 'nombreDeVerts', 'Obtenir un vert dans 20 compétences', 20),
        this.trophee('4e', 'nombreDeVerts', 'Obtenir un vert dans 30 compétences', 30),
        this.trophee('4e', 'nombreDeVerts', 'Obtenir un vert dans 50 compétences', 50)
      ]
    ]
    const ligne2 = [
      [
        this.trophee('4e', 'fractions', 'Fractions', 1),
        this.trophee('4e', 'fractions', 'Fractions', 3),
        this.trophee('4e', 'fractions', 'Fractions', 6)
      ], [
        this.trophee('4e', 'puissances', 'Puissances', 1),
        this.trophee('4e', 'puissances', 'Puissances', 4),
        this.trophee('4e', 'puissances', 'Puissances', 7)
      ]
    ]
    const ligne3 = [
      [
        this.trophee('4e', 'arithmetique', 'Arithmétique', 1),
        this.trophee('4e', 'arithmetique', 'Arithmétique', 2),
        this.trophee('4e', 'arithmetique', 'Arithmétique', 3)
      ], [
        this.trophee('4e', 'calculLitteral', 'Calcul littéral', 1),
        this.trophee('4e', 'calculLitteral', 'Calcul littéral', 4),
        this.trophee('4e', 'calculLitteral', 'Calcul littéral', 7)
      ]
    ]
    const ligne4 = [
      [
        this.trophee('4e', 'statistiques', 'Statistiques', 1),
        this.trophee('4e', 'statistiques', 'Statistiques', 2),
        this.trophee('4e', 'statistiques', 'Statistiques', 3)
      ], [
        this.trophee('4e', 'probabilites', 'Probabilités', 1),
        this.trophee('4e', 'probabilites', 'Probabilités', 2),
        this.trophee('4e', 'probabilites', 'Probabilités', 3)
      ]
    ]
    const ligne5 = [
      [
        this.trophee('4e', 'proportionnalite', 'Proportionnalité', 1),
        this.trophee('4e', 'proportionnalite', 'Proportionnalité', 4),
        this.trophee('4e', 'proportionnalite', 'Proportionnalité', 8)
      ], [
        this.trophee('4e', 'fonctions', 'Fonctions', 1),
        this.trophee('4e', 'fonctions', 'Fonctions', 2),
        this.trophee('4e', 'fonctions', 'Fonctions', 3)
      ]
    ]
    const ligne6 = [
      [
        this.trophee('4e', 'translation', 'Translation', 1),
        this.trophee('4e', 'translation', 'Translation', 2),
        this.trophee('4e', 'translation', 'Translation', 3)
      ], [
        this.trophee('4e', 'espace', 'Espace', 1),
        this.trophee('4e', 'espace', 'Espace', 2),
        this.trophee('4e', 'espace', 'Espace', 4)
      ]
    ]
    const ligne7 = [
      [
        this.trophee('4e', 'theoremeDePythagore', 'Théorème de Pythagore', 1),
        this.trophee('4e', 'theoremeDePythagore', 'Théorème de Pythagore', 4),
        this.trophee('4e', 'theoremeDePythagore', 'Théorème de Pythagore', 7)
      ], [
        this.trophee('4e', 'theoremeDeThales', 'Théorème de Thalès', 1),
        this.trophee('4e', 'theoremeDeThales', 'Théorème de Thalès', 2),
        this.trophee('4e', 'theoremeDeThales', 'Théorème de Thalès', 4)
      ]
    ]
    const ligne8 = [
      [
        this.trophee('4e', 'relatifs', 'Relatifs', 2),
        this.trophee('4e', 'cosinusDunAngleAigu', 'Cosinus d’un angle', 2),
        this.trophee('4e', 'maitriserLinformatique', 'Maîtriser l’informatique')
      ], [
        this.trophee('4e', 'presenterLeTravailDeSonGroupe', 'Présenter le travail de son groupe'),
        this.trophee('4e', 'faireUnExpose', 'Faire un exposé'),
        this.trophee('4e', 'obtenirSonBrevetDeTuteur', 'Obtenir son Brevet de tuteur')
      ]
    ]
    this.lignes = [ligne1, ligne2, ligne3, ligne4, ligne5, ligne6, ligne7, ligne8]
    this.recupereStats()
  }

  /**
   * Calcule le nombre total d'élèves,
   * Ajoute à chaque trophée le nombre d'élèves qui l'ont obtenu,
   * Met à jour le tooltip affiché au survol du trophée
   */
  recupereStats() {
    this.totalEleves = 0
    for (const eleve in this.eleves) {
      this.totalEleves++
    }
    for (const ligne of this.lignes) {
      for (const groupe of ligne) {
        for (const trophee of groupe) {
          let nb: number = 0
          for (const eleve in this.eleves) {
            if (Object.prototype.hasOwnProperty.call(this.eleves, eleve)) {
              if (trophee['nbVertsMin']) {
                if (parseInt(this.eleves[eleve][trophee['cle']]) >= trophee['nbVertsMin']) nb++
              } else {
                if (parseInt(this.eleves[eleve][trophee['cle']]) >= 1) nb++
              }
            }
          }
          trophee['nb'] = nb
          trophee['tooltip'] = this.tooltip(trophee)
          trophee['refaire'] = this.refaire(trophee)
        }
      }
    }
  }
  /**
   * Construit un objet trophée pour l'afficher sur la grille
   * @param niveau niveau concerné
   * @param cle clé du json correspondant au trophée
   * @param categorie label du trophée
   * @param nbVertsMin 
   * @returns 
   */
  trophee(niveau: string, cle: string, categorie: string, nbVertsMin?: number) {
    const base = `assets/img/trophees/${niveau}/`
    let nomImage
    let lien
    if (nbVertsMin) { // Si c'est un trophée normal
      nomImage = nbVertsMin + cle
      lien = base + this.obtenuOuPas(cle, nbVertsMin) + nomImage + '.png'
    } else { // Si c'est un trophée spécial
      nomImage = cle
      lien = base + this.obtenuOuPas(cle, 1) + nomImage + '.png'
    }
    return {
      lien: lien,
      description: this.description(categorie, nbVertsMin),
      cle: cle,
      categorie: categorie,
      nbVertsMin: nbVertsMin
    }
  }

  /**
   * Vérifie si l'élève a obtenu ce trophée ou pas
   * Renvoie le dossier d'images de trophées correspondant
   * @param cle clé du trophée dans le json
   * @param nbVertsMin 
   * @returns dossier d'images de trophées correspondant
   */
  obtenuOuPas(cle: string, nbVertsMin: number) {
    if (parseInt(this.eleve[cle]) >= nbVertsMin) {
      return 'obtenus/'
    } else {
      return 'vierges/'
    }
  }

  /**
   * Renvoie la description du trophée
   * @param categorie label du trophée
   * @param nbVertsMin 
   * @returns description du trophée
   */
  description(categorie: string, nbVertsMin?: number) {
    if (categorie.split(' ')[0] === 'Obtenir' || categorie.split(' ')[0] === 'Présenter' || categorie.split(' ')[0] === 'Faire' || !nbVertsMin) {
      return categorie
    } else {
      let vert
      nbVertsMin > 1 ? vert = 'verts' : vert = 'vert'
      return `Obtenir ${nbVertsMin} ${vert} en ${categorie}`
    }
  }

  /**
   * Renvoie un texte avec :
   * - le nombre de verts manquants pour obtenir le trophée
   * - le pourcentages d'élèves l'ayant obtenu
   * afin de l'afficher au survol du trophée
   * @param trophee
   * @returns tooltip signalant le nombre de verts manquants pour obtenir le trophée
   */
  tooltip(trophee: any) {
    const nbVertsMin = parseInt(trophee['nbVertsMin'])
    const nbVerts = parseInt(this.eleve[trophee['cle']])
    const pourcent = Math.floor(parseInt(trophee['nb']) / this.totalEleves * 100)
    let texte: string
    if (pourcent === 0) {
      texte = 'Personne n\'a déjà obtenu ce trophée,<br>'
    } else {
      texte = `${pourcent}% des élèves ont obtenu ce trophée,<br>`
    }
    if (nbVertsMin > 0) {
      if (nbVerts >= nbVertsMin) {
        texte += 'et tu en fais partie !'
      } else {
        let vert, premier
        nbVertsMin - nbVerts > 1 ? vert = 'verts' : vert = 'vert'
        pourcent === 0 ? premier = 'être le premier' : premier = 'l\'obtenir'
        texte += `pour ${premier}, il te manque ${nbVertsMin - nbVerts} ${vert} !`
      }
    } else {
      if (nbVerts > 0) {
        texte += 'et tu en fais partie !'
      } else {
        if (pourcent === 0) {
          texte += 'tu l\'auras bientôt !'
        } else {
          texte += 'tu peux toi aussi l\'avoir !'
        }
      }
    }
    return texte
  }

  /**
   * Renvoie le texte avec un lien éventuel pour refaire l'évaluation
   * @param trophee 
   * @returns 
   */
  refaire(trophee: any) {
    const nbVertsMin = parseInt(trophee['nbVertsMin'])
    const nbVerts = parseInt(this.eleve[trophee['cle']])
    const nb = parseInt(trophee['nb'])
    let texte: string = ''
    if (nb > 0 && this.peutDemanderRefaireEval && trophee['cle'] !== 'nombreDeVerts' && ((nbVerts < nbVertsMin) || (typeof (trophee['nbVertsMin']) == 'undefined' && nbVerts === 0))) {
      texte = '<a>Demander à refaire l\'évaluation</a>'
    }
    return texte
  }

  /**
   * Modifie le texte de la modale d'envoi d'un message pour refaire l'évaluation,
   * Ouvre la modale
   * @param trophee 
   */
  refaireEvaluation(trophee: any) {
    const nbVertsMin = parseInt(trophee['nbVertsMin'])
    const nbVerts = parseInt(this.eleve[trophee['cle']])
    const nb = parseInt(trophee['nb'])
    if (nb > 0 && ((nbVerts < nbVertsMin) || (typeof (trophee['nbVertsMin']) == 'undefined' && nbVerts === 0))) {
      this.texteModale = `
      Est-ce que tu veux envoyer un message à M. Valmont pour lui prévenir
      que tu veux refaire l'évaluation sur "${trophee['categorie']}" ?`
      this.sujetEval = trophee['categorie']
      this.ouvrirModal('confirmation')
    }
  }

  /**
   * Vérifie si les codes trophées collent
   * Si oui, envoie un message au propriétaire du site pour lui prévenir qu'on veut refaire une évaluation
   * Si non, demande à l'utilisateur de faire un choix
   */
  envoiConfirmation() {
    this.fermerModal('confirmation')
    if (this.codeTrophee != this.dataService.user.codeTrophees && this.dataService.user.codeTrophees != '') {
      this.texteModaleChoix = `
      Tu est sur la page de trophées de code "${this.codeTrophee}" mais dans ton profil tu as fait le lien avec le code trophées "${this.dataService.user.codeTrophees}".<br>
      Lequel est le code trophées de l'élève qui veut refaire l'évaluation ?`
      this.ouvrirModal('choix')
    } else {
      this.dataService.envoiMailEval(this.codeTrophee, this.sujetEval)
    }
  }

  /**
   * Envoie un message au propriétaire du site et ferme la modale Choix
   * @param codeTrophee 
   */
  envoiChoix(codeTrophee: string) {
    this.fermerModal('choix')
    this.dataService.envoiMailEval(codeTrophee, this.sujetEval)
  }

  /**
   * Ouvre la modale
   * @param type peut être 'choix' ou 'refaire'
   */
  ouvrirModal(type: string) {
    switch (type) {
      case 'confirmation':
        this.modal.style.display = "block";
        break;
      case 'choix':
        this.modalChoix.style.display = "block";
        break;
      default:
        break;
    }
  }

  /**
   * Ferme la modale
   * @param type peut être 'choix' ou 'refaire'
   */
  fermerModal(type: string) {
    switch (type) {
      case 'confirmation':
        this.modal.style.display = "none";
        break;
      case 'choix':
        this.modalChoix.style.display = "none";
        break;
      default:
        break;
    }
  }

}
