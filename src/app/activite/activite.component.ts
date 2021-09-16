import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activite, ActiviteSave } from '../activite';
import { Categorie } from '../categorie';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrls: ['./activite.component.scss']
})
export class ActiviteComponent implements OnInit {
  public listeActivite : Activite[];
  public position = 2;
  public urlImage: string;
  public nbr: number = 1;
  public listeCategorie: Categorie[];
  public categorie: string;
  public new_categorie: string;
  public modificationCategorie: boolean = false;
  public creationCategorie: boolean = false;
  public is_staff: boolean = false;
  public chargement: boolean = true;
  constructor(private membreService: MembreService) { }

  async ngOnInit(){
    var membre = await this.membreService.getProfil<Membre>();
    this.is_staff = membre.statut.is_staff;
    this.getAllCategorie();
    this.urlImage = this.membreService.liste.base;
  }

  async delete(element) {
    var actvt = this.listeActivite.splice(this.listeActivite.findIndex(data=> data == element),1);
    var reponse = await this.membreService.suppresionElement(this.membreService.liste.activite, element.id, element);
  }

  getAllActivite(categorie: string){
    this.categorie = categorie;
    this.chargement = true;
    this.new_categorie = this.categorie;
    delete this.listeActivite;
    this.listeActivite = new Array<Activite>();
    this.membreService.getActiviteFilter(this.membreService.liste.activite,categorie).toPromise().then(
      data => {
        this.chargement = false;
        this.listeActivite = data;
      }
    );
  }

  async getAllCategorie(){
    this.listeCategorie = await this.membreService.getElementList(this.membreService.liste.categorie).toPromise().then(
      data=>{
        return data;
      }
    );
    this.categorie = this.listeCategorie[0].type;
    this.getAllActivite(this.categorie);
  }

  modifierCategorie(){
    this.modificationCategorie = false;
    this.new_categorie = this.categorie;
    this.creationCategorie = false;
    if(this.modificationCategorie){
      this.modificationCategorie = false;
    }else{
      this.modificationCategorie = true;
    }
  }

  creerCategorie(){
    this.modificationCategorie = false;
    if(this.creationCategorie){
      this.creationCategorie = false;
    }else{
      this.creationCategorie = true;
    }
  }

  async createCategorie(){
    this.creationCategorie = false;
    var categorie = new Categorie();
    categorie.type = this.new_categorie;
    categorie = await this.membreService.createElement(this.membreService.liste.categorie,categorie);
    this.listeCategorie.push(categorie);
  }

  async updateCategorie(){
    this.modificationCategorie = false;
    var new_categorie = this.listeCategorie.find(data => data.type == this.categorie);
    console.log(new_categorie);
    new_categorie.type = this.new_categorie;
    new_categorie = await this.membreService.updateElementById(this.membreService.liste.categorie, new_categorie.id, new_categorie);
  }
  
  async deleteCategorie(){
    var element =  this.listeCategorie.find(data => data.type == this.categorie);
    this.listeCategorie.splice(this.listeCategorie.findIndex(data=>data.type==this.categorie),1);
    var categorie = element;
    categorie.type = this.new_categorie;
    categorie = await this.membreService.suppresionElement(this.membreService.liste.categorie, categorie.id, categorie);  
  }

  async cloturer(activite:Activite){
    if(activite.cloture){
      activite.cloture = false;
    }else{
      activite.cloture = true;
    }
    var new_activite = new ActiviteSave();
    new_activite.id = activite.id;
    new_activite.theme = activite.theme;
    new_activite.date = activite.date;
    new_activite.cloture = activite.cloture;
    new_activite.categorie = activite.categorie.id;
    activite = await this.membreService.updateElementById(this.membreService.liste.activite, new_activite.id, new_activite);
  }
}
