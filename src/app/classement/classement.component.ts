import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserSimplifie } from '../services/user';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class ClassementComponent implements OnInit {

  constructor(public dataService: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.recupClassement()
  }

  /**
   * Envoie l'utilisateur sur la page de trophées et indique que ce sont les trophées de user.pseudo
   * @param user
   */
   voirTropheesPerso(user: UserSimplifie) {
    this.dataService.pseudoClique = user.pseudo
    this.dataService.codeTropheesClique = user.codeTrophees
    this.router.navigate(['trophees', 'autre'])
  }
}
