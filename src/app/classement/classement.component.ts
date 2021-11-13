import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../services/user';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class ClassementComponent implements OnInit {

  constructor(public dataService: ApiService) {
  }

  ngOnInit(): void {
    this.dataService.recupClassement()
  }

}
