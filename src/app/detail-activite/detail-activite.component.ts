import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Activite } from '../activite';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-detail-activite',
  templateUrl: './detail-activite.component.html',
  styleUrls: ['./detail-activite.component.scss']
})
export class DetailActiviteComponent implements OnInit {
  public activite: Activite;
  public paragraphes= new Array<string>();
  private id: number;

  constructor(private membreService: MembreService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    /*this.membreService.getElementById(this.membreService.liste.activite,this.id).subscribe(
      (data) => {
        this.activite = data;
        for(let id of this.activite.descriptions){
          this.membreService.getElementById(this.membreService.liste.description, id).subscribe(
            (element) => {
              this.paragraphes.push(element.paragraphe);
              console.log(element);
            }
          );
        }
      }
    );*/
  }
}
