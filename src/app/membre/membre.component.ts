import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { Statut } from '../statut';

@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.scss']
})
export class MembreComponent implements OnInit {
  public liste_membre: Array<Membre>;
  public position = 1;

  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.getAllMembre();
  }

  async getAllMembre(){
    await this.membreService.getElementList(this.membreService.liste.membre).toPromise().then(
      data => {
        this.liste_membre = data;
      }
    );
  }

  async getStatut(id): Promise<string>{
    var statut = await this.membreService.getElementById(this.membreService.liste.statut, id);
    return statut.poste;
  }

  async delete(element: Membre){
    console.log(await this.membreService.suppresionElement(this.membreService.liste.membre, element.id, element));
  }
}
