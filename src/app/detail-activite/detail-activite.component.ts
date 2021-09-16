import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Activite, ActiviteSave } from '../activite';
import { Categorie } from '../categorie';
import { Description } from '../description';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { Photo } from '../photo';
import { Presence } from '../presence';

@Component({
  selector: 'app-detail-activite',
  templateUrl: './detail-activite.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false, showIndicators: true } }
  ],
  styleUrls: ['./detail-activite.component.scss']
})
export class DetailActiviteComponent implements OnInit {
  public id: number;
  public listeCategorie: Array<Categorie>;
  public activite: Activite = new Activite();
  public categorie: Categorie = new Categorie();
  public newcategorie: Categorie = new Categorie();
  public addCategorie: boolean = false;
  public modifyCategorie: boolean = false;
  public participants: Array<Membre> = new Array<Membre>();
  public urlPhotos = new Array<any>();
  public base_url: string;
  public modificationInfo: boolean = false;
  public modificationCategorie: boolean = false;
  public modificationDescription: boolean = false;
  public is_staff: boolean= false;
  public presence: boolean= false;
  public chargement: boolean= true;
  noWrapSlides = false;
  showIndicator = true;
  private counter_image = 0;

  constructor(private membreService: MembreService, private route: ActivatedRoute,
    private routeNavigate: Router,private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    this.base_url = this.membreService.liste.base;
    this.id = this.route.snapshot.params['id'];
    await this.membreService.getElementList(this.membreService.liste.categorie).toPromise().then((data)=>{
      this.listeCategorie = data;
    });
    if(this.id == 0){
      this.activite.descriptions = Array<Description>();
      this.categorie = this.listeCategorie[0];
      this.activite.categorie = this.categorie;
      var description = new Description();
      description.photos = new Array<Photo>();
      this.activite.descriptions.push(description);
    }
    else{
      await this.getActivite();
      var membre = await this.membreService.getProfil<Membre>();
      this.is_staff = membre.statut.is_staff;
      var presence = this.activite.presences.find(data=>data.membre==membre.id);
      console.log(presence.presence);
      if(presence != undefined){
        this.presence = true;
      }
    }
    this.chargement = false;
  }

  retournerActivite(){
    this.routeNavigate.navigate(['/manager/activite'])
  }

  async getActivite(): Promise<void>{
    this.activite = await this.membreService.getElementById(this.membreService.liste.activite,this.id);
    console.log(this.activite);
    for(let presence of this.activite.presences){
      this.participants.push(await this.membreService.getElementById(this.membreService.liste.membre,presence.membre));
    }
    console.log(this.activite.presences);
    this.categorie = await this.membreService.getElementById(this.membreService.liste.categorie, this.activite.categorie.id);
    console.log(this.activite.presences);
  }

  async save(){
    var activite = new ActiviteSave();
    activite.theme = this.activite.theme;
    activite.date = this.activite.date;
    activite.categorie = this.activite.categorie.id;
    activite.id = this.activite.id;
    if(this.activite.id == undefined){
      activite = await this.membreService.createElement(this.membreService.liste.activite, activite);
      this.activite.id = activite.id;
    }else{
      activite = await this.membreService.updateElementById(this.membreService.liste.activite, this.activite.id, activite);
    }
    this.saveParagraphe();
    this.retournerActivite();
  }

  onSubmit(){
    this.save();
  }

  async onSelectedCategorie(){
    var categorie = new Categorie();
    this.categorie = this.listeCategorie.find(obj => obj.type == this.categorie.type);
    this.activite.categorie = this.categorie;
    console.log(this.activite.categorie);
  }

  async onDeleteCategorie(){
    console.log(await this.membreService.suppresionElement(this.membreService.liste.categorie, this.categorie.id, this.categorie));
  }

  onCreateCategorie(){
    this.addCategorie = true;
    this.modifyCategorie = false;
  }

  onChangeCategorie(): void{
    this.addCategorie = true;
    this.modifyCategorie = true;
  }

  async modifierCategorie(): Promise<void>{
    if(this.modifyCategorie == false){
      await this.membreService.createElement(this.membreService.liste.categorie, this.newcategorie);
    }
    else{
      this.categorie = await this.membreService.updateElementById(this.membreService.liste.categorie, this.categorie.id, this.categorie);
    }
    this.retournerActivite();
  }

  addImage(event,paragraphe){
    var file = event.target.files[0];
    var reader = new FileReader();
    var photo = new  Photo();
    photo.image = file;
    reader.readAsDataURL(file);
    reader.onload = (_event)=>{
      photo.url_image = reader.result.toString();
    }
    photo.description = this.id;
    var index = this.activite.descriptions.findIndex(obj => obj == paragraphe);
    if(this.activite.descriptions[index].photos == undefined){
      this.activite.descriptions[index].photos = [];
    }
    this.activite.descriptions[index].photos.push(photo);
    this.counter_image++;
  }

  addParagraphe(){
    var paragraphe = new Description();
    this.activite.descriptions.push(paragraphe);
    var index = this.activite.descriptions.indexOf(paragraphe);
    this.activite.descriptions[index].photos = new Array<Photo>();
    this.modificationDescription = true;
  }

  saveParagraphe(){
    var description = this.activite.descriptions.filter( obj => obj.id == undefined);
    description.forEach(async (element) => {
      console.log("description create :");
      element.activite = this.activite.id;
      var resultat = await this.membreService.createElement(this.membreService.liste.description, element);
      element.photos.forEach(async (photo) =>{
        var num = element.photos.length - this.counter_image;
        this.createPhoto(photo,resultat.id, num); 
      });
    });
    var update_description = this.activite.descriptions.filter( obj => obj.id != undefined);
    update_description.forEach(async (element) =>{
      console.log("description update :");
      await this.membreService.updateElementById(this.membreService.liste.description, element.id, element);
      element.photos.filter(obj => obj.id == undefined).forEach(
        async (photo)=>{
          var num = element.photos.length - this.counter_image;
          this.createPhoto(photo,element.id,num); 
        }
      );
    });
  }

  async createPhoto(photo: Photo,id: number, num: number){
    var formdata = new FormData();
    var nom : string = "description"+id.toString()+"NUM"+num.toString()+".jpg";
    photo.url_image = this.membreService.urlImage+"/media/images/"+nom;
    this.counter_image-=1;
    formdata.append('description',""+id);
    formdata.append('image', photo.image, nom);
    formdata.append('url_image', photo.url_image.toString());
    formdata.forEach(element=>{console.log(element);});
    await this.http.post(`${this.membreService.urlImage}/api/photocreation/`,formdata).toPromise().then(
      data =>{ 
        console.log(data);
      }
    );
  }

  async deleteParagraphe(description:Description){
    if(description.id!=undefined){
      var element = await this.membreService.suppresionElement(this.membreService.liste.description, description.id, description);
    }
    var descriptions = this.activite.descriptions.splice(this.activite.descriptions.findIndex(data=>data.id==description.id),1);
  }

  /*--------------- manipulation membre presence -----------------*/
  async getMembre(id){
    var membre = await this.membreService.getElementById(this.membreService.liste.membre,id);
    return membre;
  }

  /*-------------modification-------------*/
  modifierInfo(){
    if(this.modificationInfo){
      this.modificationInfo = false;
    }else{
      this.modificationInfo = true;
    }
  }

  modifierCategorieMode(){
    if(this.modificationCategorie){
      this.modificationCategorie = false;
    }else{
      this.modificationCategorie = true;
    }
  }

  modifierDescription(){
    if(this.modificationDescription){
      this.modificationDescription = false;
    }else{
      this.modificationDescription = true;
    }
  }

  async deletePhoto(photo:Photo,description:Description){
    var element = await this.membreService.suppresionElement(this.membreService.liste.photo,photo.id,photo);
    var descr = this.activite.descriptions.find(data=>data.id == description.id)
    var photos = descr.photos.splice(descr.photos.findIndex(data=>data==photo),1);
  }

  async participation(){
    var membre = await this.membreService.getProfil<Membre>();
    var presence = this.activite.presences.find(data => data.membre == membre.id);
    if(this.presence){
      this.presence = false;
      this.activite.presences.splice(this.activite.presences.findIndex(data=>data.id==presence.id),1);
      var participants = this.participants.splice(this.participants.findIndex(data=> data == membre),1);
      await this.membreService.suppresionElement(this.membreService.liste.presence,presence.id, presence);
    }else{
      this.presence = true;
      presence = new Presence();
      presence.activite = this.activite.id;
      presence.contrepersence = false;
      presence.membre = membre.id;
      presence.presence = false;
      this.activite.presences.push(presence);
      this.participants.push(membre);
      presence = await this.membreService.createElement(this.membreService.liste.presence,presence);
    }
  }
}
