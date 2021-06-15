import { Component, OnInit, Input} from '@angular/core';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { Liste } from '../liste_element';
import { HttpClient } from '@angular/common/http';
import { PhotoProfil } from '../photoprofil';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  liste: Liste = new Liste;
  id: number = 0;
  avantmembre: Observable<Membre>;
  membre: Membre = null;
  submitted = false;
  public nom: string;
  public prenom: string;
  public adr_phys: string;
  public date_add: string;
  public file: File;
  public statut: string;
  private formData = new FormData();
  public photoprofil: PhotoProfil = null;

  urlImage: string = "http://127.0.0.1:8000";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private http: HttpClient , private membreService: MembreService,private route: ActivatedRoute,
    private routeLink: Router) { 

    }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log("id:"+this.id);
    if(this.id != 0){
      this.getMembre();
    }
  }

  async getMembre(): Promise<void>{
    this.membre = await this.membreService.getElementById(this.liste.membre,this.id);
    this.photoprofil = await this.membreService.getElementById(this.liste.photoprofil,this.membre.photoprofil);
    console.log(this.membre);
    console.log(this.photoprofil);
    this.urlImage = this.urlImage + this.photoprofil.photo;
    this.value = this.membre.id+"*"+this.membre.nom+
    "*"+this.membre.prenom+"*"+this.photoprofil.photo+"*"+this.membre.statut;
  }

  getImage(event){
    this.file = event.target.files[0];
    console.log(this.file.name);
    if(this.membre !=null){
      this.callServiceToSavePhoto()
    }
  }

  newMembre(): void{
    this.submitted = false;
    this.membre = new Membre();
  }

  callServiceToSavePhoto(): void{
    if(this.file != null){
      this.formData.append('membre',""+this.membre.id);
      this.formData.append('photo', this.file, this.file.name);
      this.http.post("http://127.0.0.1:8000/api/membrecreation/",this.formData).subscribe(
        data =>{ 
          console.log("test");
          console.log(data);
        }
      );
    }
  }

  async callServiceToSaveMembre(): Promise<void>{
    this.membre = await this.membreService.createElement(this.membreService.liste.membre,this.membre);
    await this.callServiceToSavePhoto();
  }

  async save(){
    this.membre = new Membre();
    this.membre.nom = this.nom;
    this.membre.prenom = this.prenom;
    this.membre.adr_phys = this.adr_phys;
    this.membre.date_add = this.date_add;
    this.membre.linkedin = "test";
    this.membre.statut = this.statut;
    this.callServiceToSaveMembre();
    this.routeLink.navigate(['/membre']);
  }

  onSubmit(){
    this.save();
  }
}
