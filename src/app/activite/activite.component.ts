import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activite } from '../activite';
import { MembreService } from '../membre.service';
import { Photo } from '../photo';

@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrls: ['./activite.component.scss']
})
export class ActiviteComponent implements OnInit {
  public listeActivite: Observable<Activite[]>;
  public position = 2;
  public photo: Photo[];
  public urlImage: string = "";
  public nbr: number = 1;
  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.listeActivite = this.membreService.getElementList(this.membreService.liste.activite);
  }

}
