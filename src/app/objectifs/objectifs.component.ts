import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Lien {
  reference: string;
  titre: string
}
@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: ['./objectifs.component.css']
})
export class ObjectifsComponent implements OnInit {
  liens: Lien[]

  constructor(public http: HttpClient) {
    this.liens = []
  }

  ngOnInit(): void {
    this.http.get('assets/data/objectifs.json').subscribe(
      (data: any) => {
        this.liens = []
        for (const niveau of data) {
          for (const theme of niveau.themes) {
            for (const sousTheme of theme.sous_themes) {
              for (const reference of sousTheme.objectifs) {
                this.liens.push(reference)
              }
            }
          }
        }
      }
    )
  }

}
