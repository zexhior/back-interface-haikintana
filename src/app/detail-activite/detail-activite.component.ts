import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Activite } from '../activite';
import { Categorie } from '../categorie';
import { Description } from '../description';
import { MembreService } from '../membre.service';
import { Photo } from '../photo';

@Component({
  selector: 'app-detail-activite',
  templateUrl: './detail-activite.component.html',
  styleUrls: ['./detail-activite.component.scss']
})
export class DetailActiviteComponent implements OnInit {
  public activite: Activite = new Activite();
  public paragraphes = new Array<Description>();
  public listeCategorie: Observable<Array<Categorie>>;
  public theme: string;
  public date: string;
  public addCategorie: boolean = false;
  public type: string;
  private idCategorie: number;
  public categorie: Categorie = new Categorie;
  private id: number;
  public selected: any;
  public photos = new Array<File>();
  public urlPhotos = new Array<any>();
  public listePhoto = new Array<Photo>();

  constructor(private membreService: MembreService, private route: ActivatedRoute,
    private routeNavigate: Router,private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.params['id'];
    this.listeCategorie = await this.membreService.getElementList(this.membreService.liste.categorie);
    if(this.id == 0){
      await this.listeCategorie.toPromise().then((data)=>{
        this.selected = data[0].type;
      });
      this.addParagraphe();
    }
    else{
      this.getActivite();
    }
    await this.listeCategorie.toPromise().then((data)=>{
      console.log("test "+this.id);
      console.log(data);
      for(let categorie of data){
        console.log(categorie);
        if(categorie.id == this.activite.categorie){
          this.selected = categorie.type;
          this.categorie = categorie;
        }
      }
    });
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

  async getActivite(): Promise<void>{
    this.activite = await this.membreService.getElementById(this.membreService.liste.activite,this.id)
    this.getPhoto();
    for(let id of this.activite.descriptions){
      this.paragraphes.push(await this.membreService.getElementById(this.membreService.liste.description, id));
    }
  }

  async save(){
    this.activite = new Activite();
    this.activite.theme = this.theme;
    this.activite.date = this.date;
    await this.listeCategorie.toPromise().then(
      data => {
        for(let categorie of data){
          if(categorie.type == this.selected){
            this.activite.categorie = categorie.id;
            console.log(categorie.id);
          }
        }
      }
    );
    this.activite = await this.membreService.createElement(this.membreService.liste.activite, this.activite);
    for(let photo of this.photos){
      var formdata = new FormData();
      formdata.append('url_image',photo,photo.name);
      formdata.append('activite',""+this.activite.id);
      await this.http.post("http://127.0.0.1:8000/api/photocreation/",formdata).toPromise().then(
        data =>{ 
          console.log(data);
        }
      );
    }
    for(let paragraphe of this.paragraphes){
      paragraphe.activite = this.activite.id;
      console.log(await this.membreService.createElement(this.membreService.liste.description,paragraphe))
    }
    console.log(this.activite);
  }

  onSubmit(){
    this.save();
  }

  async onSelectedCategorie(){
    console.log(this.selected);
  }

  onChangeCategorie(): void{
    this.addCategorie = true;
  }

  async modifierCategorie(): Promise<void>{
    if(this.categorie == null){
      this.categorie = new Categorie();
      this.categorie.type = this.type;
      this.categorie = await this.membreService.createElement(this.membreService.liste.categorie, this.categorie);
      console.log(this.categorie);
      this.routeNavigate.navigate(['/manager/activite'])
    }
    else{
      this.categorie.type = this.type;
      this.categorie = await this.membreService.updateElementById(this.membreService.liste.categorie, this.categorie.id, this.categorie);
      console.log("update"+this.categorie.id);
    }
  }

  async getPhoto(){
    for(let id of this.activite.photos){
      var file = await this.membreService.getElementById(this.membreService.liste.photo,id);
      this.urlPhotos.push(this.membreService.urlImage+file.url_image); 
    }
  }

  addImage(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event)=>{
      this.urlPhotos.push(reader.result);
    }
    this.photos.push(file);
  }

  addParagraphe(){
    var paragraphe = new Description();
    this.paragraphes.push(paragraphe);
  }
}
