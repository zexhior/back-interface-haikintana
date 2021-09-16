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
  public liste_membre: Membre[];
  public liste_statut: Statut[];
  public modification_statut: boolean = false;
  public creation_statut: boolean = false;
  public statut: string;
  public new_statut: string;
  public position = 1;
  public base_url: string;
  public is_staff: boolean;
  public staff_statut: boolean;
  public chargement:boolean = true;

  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.base_url = this.membreService.liste.base;
    this.getAllMembre();
  }

  async getAllMembre(){
    this.liste_statut = await this.membreService.getElementList(this.membreService.liste.statut).toPromise().then(
      async data => {
        this.chargement = false;
        if(data[0]==undefined){
          var statut = new Statut();
          statut.poste = "Administrateurs";
          statut.is_staff = true;
          statut = await this.membreService.createElement(this.membreService.liste.statut,statut);
          var membre = await this.membreService.getProfil<Membre>();
          membre.statut = statut;
          membre = await this.membreService.updateElementById(this.membreService.liste.membre,membre.id,membre);
        }else{
          this.statut = data[0].poste;
          console.log(data[0].poste);
        }
        return data;
      }
    );
    this.liste_membre = await this.membreService.getMembreFilter(this.membreService.liste.membre,this.statut).toPromise().then(
      data => {
        return data;
      }
    );
    var membre = await this.membreService.getProfil<Membre>();
    this.is_staff = membre.statut.is_staff;
    this.staff_statut = this.liste_statut[0].is_staff;
  }

  async getStatut(id): Promise<string>{
    var statut = await this.membreService.getElementById(this.membreService.liste.statut, id);
    return statut.poste;
  }

  membrePhotoURL(photo){
    return this.base_url+photo;
  }

  async delete(element: Membre){
    var membre = await this.membreService.getProfil<Membre>();
    if(element.id != membre.id){
      var listeMembre = this.liste_membre.splice(this.liste_membre.findIndex(data=>data==element),1);
      console.log(await this.membreService.suppresionElement(this.membreService.liste.membre, element.id, element));
    }
  }

  creerStatut(){
    this.modification_statut = false;
    if(this.creation_statut){
      this.creation_statut = false;
    }else{
      this.creation_statut = true;
    }
  }

  async selectionnerStatut(statut: Statut){
    this.chargement = true;
    this.statut = statut.poste;
    this.staff_statut = statut.is_staff;
    this.liste_membre = await this.membreService.getMembreFilter(this.membreService.liste.membre, this.statut).toPromise().then(
      data =>{
        this.chargement = false;
        return data;
      }
    );
  }

  modifierStatut(){
    this.creation_statut = false;
    this.new_statut = this.statut;
    if(this.modification_statut){
      this.modification_statut = false;
    }else{
      this.modification_statut = true;
    }
  }

  async deleteStatut(){
    var statut = this.liste_statut.find(data=> data.poste == this.statut);
    await this.membreService.suppresionElement(this.membreService.liste.statut,statut.id,statut);
    this.liste_statut.splice(this.liste_statut.findIndex(data => data.poste == statut.poste),1);
  }

  async createStatut(){
    this.creation_statut = false;
    var statut = new Statut();
    statut.poste = this.new_statut;
    statut.is_staff = this.staff_statut;
    statut = await this.membreService.createElement(this.membreService.liste.statut, statut);
    this.liste_statut.push(statut);
  }

  async updateStatut(){
    this.modification_statut = false;
    var statut = this.liste_statut.find(data=>data.poste == this.statut);
    statut.poste = this.new_statut;
    statut.is_staff = this.staff_statut;
    statut = await this.membreService.updateElementById(this.membreService.liste.statut, statut.id, statut);
  }

  async changeStaff(){
    if(this.staff_statut){
      this.staff_statut = false;
    }else{
      this.staff_statut = true;
    }
  }
}
