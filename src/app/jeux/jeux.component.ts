import { HttpClient } from '@angular/common/http';
import { Component, OnInit, isDevMode, HostListener } from '@angular/core';

/**
 * Interface servant à recevoir les projets scratchs depuis l'API ou le json.
 * De nombreux autres paramètres sont disponibles et non exploités.
 */
interface Projet {
  id: number,
  title: string,
  description: string,
  instructions: string,
  visibility: string,
  public: boolean,
  comments_allowed: boolean,
  is_published: boolean,
  author: {
    id: number,
    scratchteam: boolean,
    history: {
      joined: string
    },
    profile: {
      id: number,
      images: {
        "90x90": string,
        "60x60": string,
        "55x55": string,
        "50x50": string,
        "32x32": string,
      }
    }
  },
  image: string,
  images: {
    "282x218": string,
    "216x163": string,
    "200x200": string,
    "144x108": string,
    "135x102": string,
    "100x80": string
  },
  history: {
    created: string,
    modified: string,
    shared: string
  },
  stats: {
    views: number,
    loves: number,
    favorites: number,
    remixes: number
  },
  remix: {
    parent: number,
    root: number
  }
}

@Component({
  selector: 'app-jeux',
  templateUrl: './jeux.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class JeuxComponent implements OnInit {
  modal!: HTMLElement;
  srcModal: string
  projets: Projet[]
  largeurCarte: string
  paysage: boolean

  constructor(public http: HttpClient) {
    this.srcModal = ''
    this.projets = []
    this.largeurCarte = '220px'
    this.paysage = true
  }

  ngOnInit(): void {
    let modale = document.getElementById("myModal")
    if (modale != null) {
      this.modal = modale
    } else {
      console.log('élément HTML myModal n\'a pas été trouvé')
    }
    this.recuperationDesProjets()
    this.redimensionneLesCartes()
  }
  /**
   * On détecte les changements de taille de fenêtre,
   * et on ajuste la largeur des cartes en conséquence.
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.redimensionneLesCartes()
  }

  /**
   * Redimensionne les cartes.
   * En paysage, on affiche des vignettes de largeur 250px,
   * En portrait, on affiche des vignettes de 100% de la largeur.
   */
  redimensionneLesCartes() {
    if (innerWidth > innerHeight && !this.paysage) {
      this.largeurCarte = '220px'
      this.paysage = true
    } else if (innerWidth < innerHeight && this.paysage) {
      this.largeurCarte = innerWidth + 'px'
      this.paysage = false
    }
  }

  /**
   * Si on est en mode développement, on récupère les projets depuis l'API de Scratch,
   * il faut alors télécharger le json à la main et le mettre dans assets/data pour le mettre à jour
   * Si on est en mode production, on récupère les projets depuis le json.
   */
  recuperationDesProjets() {
    if (isDevMode()) {
      this.http.get<Projet[]>('/api/users/topmaths-fr/projects').subscribe(projets => {
        for (const projet of projets) {
          this.projets.push(projet)
        }
        var theJSON = JSON.stringify(projets);
        var uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

        var a = document.createElement('a');
        a.href = uri;
        a.innerHTML = "Right-click and choose 'save as...'";
        document.body.appendChild(a);
      })
    } else {
      this.http.get<Projet[]>('assets/data/projetsScratch.json').subscribe(projets => {
        for (const projet of projets) {
          this.projets.push(projet)
        }
      })
    }
  }

  /**
   * Au lancement de la modale on détermine si on est en portrait ou en paysage,
   * en portrait, la modale prend toute la largeur,
   * en paysage, la modale prend 95 % de la hauteur.
   * @returns la largeur de la modale
   */
  determinerLargeurJeu() {
    if (window.innerHeight * 0.95 * 1.33 < window.innerWidth) {
      return `width: ${Math.floor(window.innerHeight * 0.95 * 1.33).toString()}px;` //La fenêtre de jeu est en 4/3 et il y a 5% d'espace pour permettre de fermer la modale
    } else {
      return 'width: 100%;'
    }
  }

  /**
   * Ouvre la modale avec le jeu scratch
   * @param id id du jeu
   */
  ouvrirModal(id: number) {
    this.srcModal = `https://scratch.mit.edu/projects/${id}/embed`
    this.modal.style.display = "block";
  }

  /**
   * Ferme la modale
   */
  fermerModal() {
    this.modal.style.display = "none";
    this.srcModal = ''
  }

}
