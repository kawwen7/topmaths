import { Component, OnInit } from '@angular/core';

interface Exercice {
  id: number;
  couleur: string;
  slug: string;
}

let exercice1: Exercice = {
  id : 0,
  couleur: "",
  slug: ""
}

let exercice2: Exercice = {
  id : 1,
  couleur: "",
  slug: ""
}

let exercice3: Exercice = {
  id : 2,
  couleur: "",
  slug: ""
}

function ajouteExercices(exercices : Exercice[], liensExercices : string[]){
  for (let i = 0; i < exercices.length; i++) {
    liensExercices[i] = "https://coopmaths.fr/exercice.html?ex=" + exercices[i].slug + "i=0&amp;v=e"
  }
}

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit {
  titre : string
  rappelDuCours : string
  slugVideo : string
  VideoSrc : string
  auteurVideo : string
  lienAuteurVideo : string
  exercices : Exercice[]
  liensExercices : string[]
  trackByFn(index : any, exercice : Exercice) {
    return exercice.couleur;
  }
  constructor() { 
    this.titre = '5C11 : Traduire un enchaînement d’opérations à l’aide d’une expression avec des parenthèses'
    this.rappelDuCours = '<img src="../assets/img/Vocabulaire-des-operations.png"/>'
    this.slugVideo = 'fpqFXBis5nQ'
    this.VideoSrc = "https://www.youtube.com/embed/" + this.slugVideo
    this.auteurVideo = "*Mme Maths*"
    this.lienAuteurVideo = "https://www.youtube.com/channel/UCJm9gdUbZhS0m8xGPQySgzg"
    this.exercices = []
    this.exercices.push(exercice1, exercice2, exercice3)
    this.exercices[0].couleur = "jaune"
    this.exercices[0].slug = "5C11,s=1,s2=false,s3=true,s4=true,n=1"
    this.exercices[1].couleur = "vert clair"
    this.exercices[1].slug = "5C12-1,s=2,s2=false,s3=true,s4=true,n=1"
    this.exercices[2].couleur = "vert foncé"
    this.exercices[2].slug = "5C12-1,s=3,s2=false,s3=true,s4=true,n=1"
    this.liensExercices = []
    ajouteExercices(this.exercices, this.liensExercices)
  }

  ngOnInit(): void {
  }

}
