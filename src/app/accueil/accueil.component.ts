import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class AccueilComponent implements OnInit {
  portrait : boolean
  constructor(public dataService: ApiService) {
    this.portrait = true
    this.isPortraitUpdate()
  }

  ngOnInit(): void {
  }

  /**
   * On détecte les changements de taille de fenêtre,
   * et on ajuste la largeur des cartes en conséquence.
   * @param event
   */
   @HostListener('window:resize', ['$event'])
   onResize(event: any) {
     this.isPortraitUpdate()
   }

   /**
    * Vérifie si l'écran est en portrait ou en paysage
    * et met à jour this.isPortrait
    */
   isPortraitUpdate() {
    window.innerHeight > window.innerWidth ? this.portrait = true : this.portrait = false
   }
}
