import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Niveau, Trophee, Trophee4e, Trophee5e } from '../services/trophees';


@Component({
  selector: 'app-trophees',
  templateUrl: './trophees.component.html',
  styleUrls: ['./trophees.component.css']
})
export class TropheesComponent implements OnInit {
  totalEleves: number
  annee: string
  eleves!: Trophee4e[] | Trophee5e[]
  lignes!: Trophee[][][]
  stats!: any
  modal!: HTMLElement
  modalChoix!: HTMLElement
  texteModale: string
  texteModaleChoix: string
  sujetEval: string
  peutDemanderRefaireEval: boolean
  timeoutExpire: boolean
  codeTropheesUrl: string

  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService) {
    this.totalEleves = 0
    this.annee = ''
    this.texteModale = ''
    this.texteModaleChoix = ''
    this.sujetEval = ''
    this.peutDemanderRefaireEval = false
    this.timeoutExpire = false
    this.codeTropheesUrl = ''
    dataService.profilModifie.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('trophees')) {
        this.recupereTrophees(dataService.trophees.niveau)
        if (dataService.trophees.peutDemanderEval == 'oui') this.peutDemanderRefaireEval = true
        else this.peutDemanderRefaireEval = false
      }
    })
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    let modale = document.getElementById("modaleRefaireEvaluation")
    if (modale != null) {
      this.modal = modale
    } else {
      console.log('élément HTML modaleRefaireEvaluation n\'a pas été trouvé')
    }
    modale = document.getElementById("modaleChoixCodeTrophee")
    if (modale != null) {
      this.modalChoix = modale
    } else {
      console.log('élément HTML modaleChoixCodeTrophee n\'a pas été trouvé')
    }
    setTimeout(() => {
      this.timeoutExpire = true
    }, 3000);
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      if (params.ref == 'autre') {
        this.codeTropheesUrl = ''
        this.dataService.getTrophees(this.dataService.lienTropheesClique, '')
      } else {
        this.codeTropheesUrl = params.ref
        this.dataService.getTrophees('', this.codeTropheesUrl)
      }
    })
  }

  /**
   * Construit la liste de trophées à afficher
   */
  recupereTrophees(annee: string) {
    if (annee == '4e') this.annee = '4ème'
    else if (annee == '5e') this.annee = '5ème'
    this.http.get<Niveau[]>('assets/data/listeTrophees.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        if (niveau.nom == annee) {
          this.lignes = []
          let i = 1, ligne = [], groupe = []
          for (const trophee of niveau.trophees) {
            groupe.push(this.trophee(annee, trophee.id, trophee.cle, trophee.categorie, trophee.nbVertsMin))
            if (i % 3 == 0) {
              ligne.push(groupe)
              groupe = []
            }
            if (i % 6 == 0) {
              this.lignes.push(ligne)
              ligne = []
            }
            i++
          }
        }
      }
      this.http.get(`assets/data/stats${annee}.json`).subscribe(stats => {
        this.stats = stats
        this.recupereStats()
      })
    }
    )
  }

  /**
   * Récupère le nombre total d'élèves,
   * Ajoute à chaque trophée le nombre d'élèves qui l'ont obtenu,
   * Met à jour le tooltip affiché au survol du trophée
   */
  recupereStats() {
    this.totalEleves = this.getTropheeStat({id: 'total', lien: '', description: '', cle: '', categorie: '', nbVertsMin: 0, nb: 0, tooltip: '', refaire: ''})
    for (const ligne of this.lignes) {
      for (const groupe of ligne) {
        for (const trophee of groupe) {
          trophee.nb = this.getTropheeStat(trophee)
          trophee.tooltip = this.tooltip(trophee)
          trophee.refaire = this.refaire(trophee)
        }
      }
    }
  }

  getTropheeStat(trophee: Trophee) {
    for (const stat of this.stats) {
      if (this.hasKey(stat, trophee.id)) {
        return stat[trophee.id]
      }
    }
    return 999
  }
  /**
   * Construit un objet trophée pour l'afficher sur la grille
   * @param niveau niveau concerné
   * @param cle clé du json correspondant au trophée
   * @param categorie label du trophée
   * @param nbVertsMin 
   * @returns 
   */
  trophee(niveau: string, id: string, cle: string, categorie: string, nbVertsMin: number = 0) {
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
    return new Trophee(id, lien, this.description(categorie, nbVertsMin), cle, categorie, nbVertsMin, 0, '', '')
  }

  /**
   * Vérifie si l'élève a obtenu ce trophée ou pas
   * Renvoie le dossier d'images de trophées correspondant
   * @param cle clé du trophée dans le json
   * @param nbVertsMin 
   * @returns dossier d'images de trophées correspondant
   */
  obtenuOuPas(cle: string, nbVertsMin: number) {
    if (this.hasKey(this.dataService.trophees, cle)) {
      if (this.dataService.trophees[cle] >= nbVertsMin) {
        return 'obtenus/'
      } else {
        return 'vierges/'
      }
    } else {
      return 'erreurCleTrophee/'
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
  tooltip(trophee: Trophee) {
    const nbVertsMin = trophee.nbVertsMin
    let nbVerts: number = 0
    if (this.hasKey(this.dataService.trophees, trophee.cle)) {
      const nombreVerts = this.dataService.trophees[trophee.cle]
      typeof (nombreVerts) == 'string' ? nbVerts = parseInt(nombreVerts) : nbVerts = nombreVerts
    }
    const pourcent = Math.floor(trophee.nb / this.totalEleves * 100)
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
  refaire(trophee: Trophee) {
    const nbVertsMin = trophee.nbVertsMin
    let nbVerts: number = 0
    if (this.hasKey(this.dataService.trophees, trophee.cle)) {
      const nombreVerts = this.dataService.trophees[trophee.cle]
      typeof (nombreVerts) == 'string' ? nbVerts = parseInt(nombreVerts) : nbVerts = nombreVerts
    }
    const nb = trophee.nb
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
  refaireEvaluation(trophee: Trophee) {
    const nbVertsMin = trophee.nbVertsMin
    let nbVerts: number = 0
    if (this.hasKey(this.dataService.trophees, trophee.cle)) {
      const nombreVerts = this.dataService.trophees[trophee.cle]
      typeof (nombreVerts) == 'string' ? nbVerts = parseInt(nombreVerts) : nbVerts = nombreVerts
    }
    const nb = trophee.nb
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
    if (this.codeTropheesUrl != this.dataService.user.codeTrophees && this.dataService.user.codeTrophees != '') {
      this.texteModaleChoix = `
      Tu es sur la page de trophées de code "${this.codeTropheesUrl}" mais dans ton profil tu as fait le lien avec le code trophées "${this.dataService.user.codeTrophees}".<br>
      Lequel est le code trophées de l'élève qui veut refaire l'évaluation ?`
      this.ouvrirModal('choix')
    } else {
      this.dataService.envoiMailEval(this.codeTropheesUrl, this.sujetEval)
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

  // `PropertyKey` is short for "string | number | symbol"
  // since an object key can be any of those types, our key can too
  // in TS 3.0+, putting just "string" raises an error
  hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj
  }
}
