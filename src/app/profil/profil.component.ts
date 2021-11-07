import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Options } from '@angular-slider/ngx-slider';
import { User } from '../services/user'
import { ApiService } from '../services/api.service';
interface Slider {
  value: number,
  options: Options
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  lienAvatar: string
  yeux: Slider
  sourcils: Slider
  bouche: Slider
  accessoire: Slider
  cheveux: Slider
  couleurPeau: Slider
  couleurCheveux: Slider
  modal: any
  user: User

  constructor(public appComponent: AppComponent, private dataService: ApiService) {
    this.yeux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 26,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.sourcils = {
      value: 1,
      options: {
        floor: 1,
        ceil: 10,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.bouche = {
      value: 1,
      options: {
        floor: 1,
        ceil: 30,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.accessoire = {
      value: 1,
      options: {
        floor: 1,
        ceil: 7,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.cheveux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 32,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.couleurPeau = {
      value: 1,
      options: {
        floor: 1,
        ceil: 5,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.couleurCheveux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 14,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.user = dataService.recupereProfil()
    this.lienAvatar = this.user.lienAvatar
  }

  ngOnInit(): void {
    this.modal = document.getElementById("myModal")
  }

  /**
   * Place les sliders aléatoirement pour créer un avatar aléatoire
   */
  avatarAleatoire(){
    let yeux = 1
    let sourcils = 1
    let bouche = 1
    let accessoire = 1
    let cheveux = 1
    let couleurPeau = 1
    let couleurCheveux = 1
    if (typeof(this.yeux.options.ceil) != 'undefined') yeux = Math.random()*this.yeux.options.ceil
    this.yeux.value = yeux
    if (typeof(this.sourcils.options.ceil) != 'undefined') sourcils = Math.random()*this.sourcils.options.ceil
    this.sourcils.value = sourcils
    if (typeof(this.bouche.options.ceil) != 'undefined') bouche = Math.random()*this.bouche.options.ceil
    this.bouche.value = bouche
    if (typeof(this.accessoire.options.ceil) != 'undefined') accessoire = Math.random()*this.accessoire.options.ceil
    this.accessoire.value = accessoire
    if (typeof(this.cheveux.options.ceil) != 'undefined') cheveux = Math.random()*this.cheveux.options.ceil
    this.cheveux.value = cheveux
    if (typeof(this.couleurPeau.options.ceil) != 'undefined') couleurPeau = Math.random()*this.couleurPeau.options.ceil
    this.couleurPeau.value = couleurPeau
    if (typeof(this.couleurCheveux.options.ceil) != 'undefined') couleurCheveux = Math.random()*this.couleurCheveux.options.ceil
    this.couleurCheveux.value = couleurCheveux
    this.majLienAvatar()
  }

  /**
   * Met à jour le lien de l'avatar à partir des données des sliders.
   * @param event non utilisé
   */
  majLienAvatar(event?: any) {
    this.lienAvatar = `https://avatars.dicebear.com/api/adventurer/topmaths.svg?radius=50&eyes=${this.format(this.yeux)}&eyebrows=${this.format(this.sourcils)}&mouth=${this.format(this.bouche)}&accessoires=${this.format(this.accessoire, 'accessoire')}&hair=${this.format(this.cheveux, 'cheveux')}&skinColor=${this.format(this.couleurPeau)}&hairColor=${this.format(this.couleurCheveux, 'couleurCheveux')}`
  }

  /**
   * Enregistre le lienAvatar dans le localStorage et ferme la modale
   */
  enregistrerAvatar(){
    this.dataService.majAvatar(this.lienAvatar)
    this.modal.style.display = "none";
  }

  /**
   * Formate correctement les différentes variables pour la mettre dans l'url de dicebear
   * Par défaut, le formatage est de la forme 'variant' + this.nb2chiffres(trait.value)
   * Certains traits ne respectent pas ce formatage et sont signalés via le paramètre special
   * @param trait peut être le slider correspondant aux yeux, sourcils, bouche, accessoire, cheveux, couleurPeau ou couleurCheveux
   * @param special peut être 'accessoire', 'cheveux' ou 'couleurCheveux'
   * @returns string correctement formaté pour insertion dans l'url de dicebear
   */
  format(trait: Slider, special?: string) {
    if (special === 'accessoire') {
      switch (trait.value) {
        case 1:
          return 'sunglasses&accessoiresProbability=0'
        case 2:
          return 'sunglasses&accessoiresProbability=100'
        case 3:
          return 'glasses&accessoiresProbability=100'
        case 4:
          return 'smallGlasses&accessoiresProbability=100'
        case 5:
          return 'mustache&accessoiresProbability=100'
        case 6:
          return 'blush&accessoiresProbability=100'
        case 7:
          return 'birthmark&accessoiresProbability=100'
        default:
          return 'sunglasses&accessoiresProbability=0'
      }
    } else if (special === 'cheveux') {
      if (trait.value <= 20) {
        return 'long' + this.nb2chiffres(trait.value)
      } else {
        return 'short' + this.nb2chiffres(trait.value - 20)
      }
    } else if (special === 'couleurCheveux') {
      switch (trait.value) {
        case 1:
          return 'red01'
        case 2:
          return 'red02'
        case 3:
          return 'red03'
        case 4:
          return 'blonde01'
        case 5:
          return 'blonde02'
        case 6:
          return 'blonde03'
        case 7:
          return 'brown01'
        case 8:
          return 'brown02'
        case 9:
          return 'black'
        case 10:
          return 'gray'
        case 11:
          return 'green'
        case 12:
          return 'blue'
        case 13:
          return 'pink'
        case 14:
          return 'purple'
        default:
          return 'red01'
      }
    } else {
      return 'variant' + this.nb2chiffres(trait.value)
    }
  }

  /**
   * Ajoute un 0 aux nombres à un chiffre
   * Convertir les nombres en string
   * @param nb 
   * @returns string
   */
  nb2chiffres(nb: number) {
    if (nb < 1) {
      return '01'
    } else if (nb < 10) {
      return '0' + Math.floor(nb)
    } else {
      return Math.floor(nb).toString()
    }
  }

  /**
   * Ouvre la modale de création d'avatar
   */
  ouvrirModal() {
    this.modal.style.display = "block"
  }

  /**
   * Ferme la modale
   */
  fermerModal() {
    const lienAvatar = this.dataService.getToken('lienAvatar')
    if (lienAvatar != null) this.user.lienAvatar = lienAvatar
    this.lienAvatar = this.user.lienAvatar
    this.modal.style.display = "none"
  }

}
