import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: ['./objectifs.component.css']
})
export class ObjectifsComponent implements OnInit {
  references: string[]
  titres: string[]

  constructor(public http: HttpClient) {
    this.references = []
    this.titres = []
  }
  
  ngOnInit(): void {
      this.http.get('assets/data/objectifs.json').subscribe(
        (data) => {
          let json = JSON.parse(JSON.stringify(data))
          this.references = []
          for (let niveau in json) {
            for (let theme in json[niveau]) {
              for (let sousTheme in json[niveau][theme]) {
                Object.keys(json[niveau][theme][sousTheme]).forEach((element: string) => {
                  this.references.push(element);
                });
                for (let reference in json[niveau][theme][sousTheme]) {
                  this.titres.push(json[niveau][theme][sousTheme][reference].titre)
                }
              }
            }
          }
        }
      )
  }

}
