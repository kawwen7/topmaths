import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-whosonline',
  templateUrl: './whosonline.component.html',
  styleUrls: ['../../assets/css/mystyles.css']
})
export class WhosonlineComponent implements OnInit {

  constructor(public dataService: ApiService) { }

  ngOnInit(): void {
  }

}
