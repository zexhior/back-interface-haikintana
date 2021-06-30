import { HttpClient } from '@angular/common/http';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { runInThisContext } from 'node:vm';
import { Observable } from 'rxjs';
import { Activite, ActiviteSave } from '../activite';
import { Categorie } from '../categorie';
import { Description } from '../description';
import { MembreService } from '../membre.service';
import { Photo } from '../photo';
import { PhotoProfil } from '../photoprofil';

@Component({
  selector: 'app-detail-activite',
  templateUrl: './detail-activite.component.html',
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
  public urlPhotos = new Array<any>();
  private counter_image = 0;

  constructor(private membreService: MembreService, private route: ActivatedRoute,
    private routeNavigate: Router,private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
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
      this.getActivite();
    }
  }

  retournerActivite(){
    this.routeNavigate.navigate(['/manager/activite'])
  }

  async getActivite(): Promise<void>{
    this.activite = await this.membreService.getElementById(this.membreService.liste.activite,this.id);
    this.categorie = await this.membreService.getElementById(this.membreService.liste.categorie, this.activite.categorie.id);
  }

  async save(){
    var activite = new ActiviteSave();
    activite.theme = this.activite.theme;
    activite.date = this.activite.date;
    activite.categorie = this.activite.categorie.id;
    activite.id = this.activite.id;
    if(this.activite.id == undefined){
      activite = await this.membreService.createElement(this.membreService.liste.activite, activite);
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
      //this.urlPhotos.push(reader.result);
    }
    photo.description = this.id;
    var index = this.activite.descriptions.findIndex(obj => obj == paragraphe);
    this.activite.descriptions[index].photos.push(photo);
    this.counter_image++;
  }

  addParagraphe(){
    var paragraphe = new Description();
    this.activite.descriptions.push(paragraphe);
    var index = this.activite.descriptions.indexOf(paragraphe);
    this.activite.descriptions[index].photos = new Array<Photo>();
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
    this.counter_image-=1;
    formdata.append('description',""+id);
    formdata.append('image', photo.image, nom);
    formdata.append('url_image', "http://127.0.0.1:8000/media/images/"+nom);
    formdata.forEach(element=>{console.log(element);});
    await this.http.post("http://127.0.0.1:8000/api/photocreation/",formdata).toPromise().then(
      data =>{ 
        console.log(data);
      }
    );
  }

  async deleteParagraphe(){
    var description = this.activite.descriptions.pop();
    description = await this.membreService.suppresionElement(this.membreService.liste.description, description.id, description);
  }
}
