import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../services/user';

@Component({
  selector: 'app-whosonline',
  templateUrl: './whosonline.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class WhosonlineComponent implements OnInit {

  constructor(public dataService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }
  /**
   * Envoie l'utilisateur sur la page de classement et l'ancre correspondant au pseudo cliqué
   * @param user 
   */
  voirClassementPerso(user: User){
    this.router.navigate(['classement'], { fragment: user.pseudo })
  }

  /**
   * Envoie l'utilisateur sur la page de trophées et indique que ce sont les trophées de user.pseudo
   * @param user 
   */
  voirTropheesPerso(user: User) {
    this.dataService.pseudoClique = user.pseudo
    this.dataService.codeTropheesClique = user.codeTrophees
    this.router.navigate(['trophees', 'autre'])
  }
}
