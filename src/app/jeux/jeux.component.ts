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
  image: string
}

@Component({
  selector: 'app-jeux',
  templateUrl: './jeux.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class JeuxComponent implements OnInit {
  modal: any
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
    this.modal = document.getElementById("myModal")
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
  redimensionneLesCartes(){
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
      this.http.get('/api/users/topmaths-fr/projects').subscribe((projets: any) => {
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
      this.http.get('assets/data/projetsScratch.json').subscribe((projets: any) => {
        for (const projet of projets) {
          this.projets.push(projet)
        }
      })
    }
  }

  /**
   * Au lancement de la modale on détermine si on est en portrait ou en paysage,
   * en portrait, la modale prend toute la largeur,
   * en paysage, la modale prend 60% de la largeur.
   * @returns 'width: 100%;' ou 'width: 60%;'
   */
  determinerLargeurJeu() {
    if (window.innerHeight > window.innerWidth) {
      return 'width: 100%;'
    } else {
      return 'width: 60%;'
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
