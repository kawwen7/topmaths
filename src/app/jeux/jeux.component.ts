import { HttpClient } from '@angular/common/http';
import { Component, OnInit, isDevMode, HostListener } from '@angular/core';

interface Projet {
  id: number,
  title: string,
  description: string,
  instructions: string,
  history: {
    created: string,
    modified: string,
    shared: string,
  },
  stats: {
    views: number,
    loves: number,
    favorites: number,
    comments: number
  }
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
    this.largeurCarte = '250px'
    this.paysage = true
  }

  ngOnInit(): void {
    this.modal = document.getElementById("myModal")
    this.recuperationDesProjets()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : any) {
    if(innerWidth > innerHeight && !this.paysage) {
      this.largeurCarte = '250px'
      this.paysage = true
    } else if (innerWidth < innerHeight && this.paysage) {
      this.largeurCarte = innerWidth + 'px'
      this.paysage = false
    }
  }

  recuperationDesProjets() {
    if(isDevMode()) {
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

  determinerLargeurJeu() {
    if (window.innerHeight > window.innerWidth) {
      return 'width: 100%;'
    } else {
      return 'width: 60%;'
    }
  }

  ouvrirModal(id: number) {
    this.srcModal = `https://scratch.mit.edu/projects/${id}/embed`
    this.modal.style.display = "block";
  }

  fermerModal() {
    this.modal.style.display = "none";
    this.srcModal = ''
  }

}
