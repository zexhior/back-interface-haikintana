import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activite } from '../activite';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrls: ['./activite.component.scss']
})
export class ActiviteComponent implements OnInit {
  public listeActivite : Observable<Activite[]>;
  public position = 2;
  public urlImage: string = this.membreService.urlImage;
  public nbr: number = 1;
  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.listeActivite = this.membreService.getElementList(this.membreService.liste.activite);
    this.getAllActivite();
  }

  async delete(element) {
    console.log(await this.membreService.suppresionElement(this.membreService.liste.activite, element.id, element));
    this.getAllActivite();
  }

  getAllActivite(){
    this.listeActivite = this.membreService.getElementList(this.membreService.liste.activite);
  }
}
