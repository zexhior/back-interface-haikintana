import { Component, OnInit, ChangeDetectorRef,Input} from '@angular/core';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { Liste } from '../liste_element';
import { HttpClient } from '@angular/common/http';
import { PhotoProfil } from '../photoprofil';
import { Observable } from 'rxjs';
import { Numero } from '../numero';
import { Fb } from '../fb';
import { Mail } from '../mail';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  liste: Liste = new Liste;
  id: number = 0;
  avantmembre: Observable<Membre>;
  membre: Membre = new Membre();
  submitted = false;
  public nom: string;
  public prenom: string;
  public adr_phys: string;
  public date_add: string;
  public file: File;
  public statut: string;
  private formData = new FormData();
  public photoprofil: PhotoProfil = null;
  public liste_numero = new Array<Numero>();
  public liste_fb = new Array<Fb>();
  public liste_mail = new Array<Mail>(); 

  urlImage: string = "http://127.0.0.1:8000";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private http: HttpClient , private membreService: MembreService,private route: ActivatedRoute,
    private routeLink: Router, private changeDetection: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log("id:"+this.id);
    if(this.id != 0){
      this.getMembre();
    }
    else{
      this.addNum();
      this.addMail();
      this.addFb();
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
    for(let numero of this.membre.nummembre){
      var num = await this.membreService.getElementById(this.membreService.liste.numero, numero);
      this.liste_numero.push(num);
    }
    for(let fb of this.membre.fbmembre){
      var compte = await this.membreService.getElementById(this.membreService.liste.fb, fb);
      this.liste_fb.push(compte);
    }
    for(let mail of this.membre.mailmembre){
      var adr = await this.membreService.getElementById(this.membreService.liste.mail,mail);
      this.liste_mail.push(adr);
    }
  }

  newMembre(): void{
    this.submitted = false;
    this.membre = new Membre();
  }

  async callServiceToSaveMembre(): Promise<void>{
    if(this.id == 0){
      this.membre = await this.membreService.createElement(this.membreService.liste.membre,this.membre);
      this.saveNumeros();
      this.saveFbs();
      this.saveMails();
    }
    else{
      //this.membre = await this.membreService.updateElementById(this.membreService.liste.membre,this.id,this.membre);
      console.log(await this.membreService.updateElementById(this.membreService.liste.membre,this.id,this.membre));
    }
    await this.callServiceToSavePhoto();
  }

  async save(){
    this.membre.linkedin = "test";
    this.callServiceToSaveMembre();
    this.routeLink.navigate(['/manager/membre']);
  }

  onSubmit(){
    this.save();
  }

  async callServiceToSavePhoto(){
    if(this.file != null){
      this.formData.append('photo', this.file, this.file.name);
      this.formData.append('membre',""+this.membre.id);
      if(this.id == 0){
        console.log("create");
        this.formData.append('id',""+this.id);
        await this.http.post("http://127.0.0.1:8000/api/membrecreation/",this.formData).toPromise().then(
          data =>{ 
            console.log("test");
            console.log(data);
          }
        );
      }
      else{
        console.log("udpate");
        this.formData.append('id',""+this.photoprofil.id);
        await this.http.put("http://127.0.0.1:8000/api/membrecreation/",this.formData).toPromise().then(
          data =>{ 
            console.log("test");
            console.log(data);
          }
        );
      }
    }
  }

  getImage(event){
    this.file = event.target.files[0];
    if(this.photoprofil == null){
      this.photoprofil = new PhotoProfil();
    }
    this.photoprofil.photo = this.file;
    console.log(this.photoprofil.photo);
    var reader = new FileReader();
    reader.readAsDataURL(this.photoprofil.photo);
    reader.onload = (_event)=>{
      this.urlImage = reader.result.toString();
    }
  }

  addNum(): void{
    var num = new Numero();
    this.liste_numero.push(num);
  }

  async saveNumeros(){
    for(let numero of this.liste_numero){
      numero.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.numero,numero);
    }
  }

  addFb(): void{
    var fb = new Fb();
    this.liste_fb.push(fb);
  }

  async saveFbs(){
    for(let fb of this.liste_fb){
      fb.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.fb,fb);
    }
  }

  addMail(): void{
    var mail = new Mail();
    this.liste_mail.push(mail);
  }

  async saveMails(){
    for(let mail of this.liste_mail){
      mail.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.mail,mail);
    }
  }

}
