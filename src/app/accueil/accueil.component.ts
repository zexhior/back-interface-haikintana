import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activite } from '../activite';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  public listeActivite: Observable<Activite>;
  public urlImageBase: string;

  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.listeActivite = this.membreService.getElementList(this.membreService.liste.activite);
  }

}
