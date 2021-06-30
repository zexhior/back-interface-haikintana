import { Component, OnInit, ChangeDetectorRef,Input} from '@angular/core';
import { Membre, MembreSave} from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { Liste } from '../liste_element';
import { HttpClient } from '@angular/common/http';
import { PhotoProfil } from '../photoprofil';
import { Numero } from '../numero';
import { Fb } from '../fb';
import { Mail } from '../mail';
import { Statut } from '../statut';
import { AuthService } from '../auth.service';
import { TestObject } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  liste: Liste = new Liste;
  id: number = 0;
  membre: Membre = new Membre();
  current_membre: Membre = new Membre();
  public file: File;
  private formData = new FormData();
  public photoprofil: PhotoProfil = null;
  public liste_statut = new Array<Statut>();
  private new_statut = new Statut();
  public statut = new Statut();
  public change_statut: boolean = false;
  public modify_statut: boolean = false;
  public poste: string;
  public firstpwd: string;
  public message_mdp: string;
  urlImage: string = "http://127.0.0.1:8000";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private http: HttpClient , 
    private membreService: MembreService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private routeLink: Router, private changeDetection: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if(this.id != 0){
      this.getMembre();
    }
    else{
      this.membre.mailmembre = [];
      this.membre.fbmembre = [];
      this.membre.nummembre = [];
      this.statut = this.liste_statut[0];
    }
    this.getAllStatut();
  }

  async getMembre(): Promise<void>{
    this.current_membre = await this.membreService.getProfil();
    this.membre = await this.membreService.getElementById(this.liste.membre,this.id);
    this.urlImage = this.urlImage + this.membre.photoprofil.photo;
    this.value = this.membre.id+"*"+this.membre.nom+
    "*"+this.membre.prenom+"*"+this.membre.photoprofil+"*"+this.membre.statut;
    this.statut = this.membre.statut;
  }

  async callServiceToSaveMembre(): Promise<void>{
    var membre = new MembreSave();
    membre.nom = this.membre.nom;
    membre.prenom = this.membre.prenom;
    membre.statut = this.membre.statut.id;
    membre.id = this.membre.id;
    membre.date_add =this.membre.date_add;
    membre.adr_phys = this.membre.adr_phys;
    membre.linkedin = this.membre.linkedin;
    membre.mdp = this.membre.mdp;
    if(this.id == 0){
      console.log("create membre");
      membre = await this.membreService.createElement(this.membreService.liste.membre, membre);
      this.membre.id = membre.id;
      console.log(this.membre);
      this.callServiceToSavePhoto();
      this.authService.creationUser(this.membre.id,this.membre.mailmembre[0].adr_mail);
    }
    else{
      console.log("update membre");
      this.callServiceToSavePhoto();
      membre = await this.membreService.updateElementById(this.membreService.liste.membre, this.id, membre);
    }
    this.saveNumeros();
    this.saveFbs();
    this.saveMails();
  }

  async save(){
    if(this.id == 0){
      if(this.firstpwd == this.membre.mdp){
        if(this.membre.mdp.length > 7){
          this.callServiceToSaveMembre();
          this.goToListeMembre();
        }else{
          this.message_mdp = "Mot de passe trop court";
        }
      }
      else{
        this.message_mdp = "Les deux mot de passe ne se correspondent pas";
      }
    }
    else{
      this.callServiceToSaveMembre();
      this.goToListeMembre();
    }
  }

  goToListeMembre(){
    this.routeLink.navigate(['/manager/membre']);
  }

  onSubmit(){
    this.save();
  }

  async callServiceToSavePhoto(){
    console.log("save photo");
    this.formData.append('photo', this.membre.photoprofil.photo,this.membre.nom+"_"+this.membre.prenom+".jpg");
    this.formData.append('membre',""+this.membre.id);
    if(this.membre.photoprofil.id == undefined){
      console.log("create photo :");
      this.membreService.savePhotoProfil(this.formData);
    }
    else{
      console.log("udpate photo :");
      this.formData.append('id',""+this.membre.photoprofil.id);
      this.membreService.updatePhotoProfil(this.formData);
    }
    console.log("id : "+this.formData.get('id'));
    console.log("photo : "+this.formData.get('photo'));
    console.log("membre : "+this.formData.get('membre'));
  }

  getImage(event){
    this.file = event.target.files[0];
    if(this.membre.photoprofil == null){
      this.membre.photoprofil = new PhotoProfil();
    }
    this.membre.photoprofil.photo = this.file;
    console.log(this.membre.photoprofil.photo);
    var reader = new FileReader();
    reader.readAsDataURL(this.membre.photoprofil.photo);
    reader.onload = (_event)=>{
      this.urlImage = reader.result.toString();
    }
  }

  addNum(): void{
    var num = new Numero();
    this.membre.nummembre.push(num);
  }

  async deleteLastNum(){
    var numero = this.membre.nummembre.pop();
    console.log(this.membreService.suppresionElement(this.membreService.liste.numero, numero.id, numero));
  }

  async saveNumeros(){
    var newnum = this.membre.nummembre.filter(obj => obj.id != undefined).forEach(async (numero)=>{
      numero = await this.membreService.updateElementById(this.membreService.liste.numero, numero.id, numero);
    });
    console.log(newnum);
    var num = this.membre.nummembre.filter(obj => obj.id == undefined).forEach(async (numero)=>{
      numero.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.numero,numero);
    });
    console.log(num);
  }

  addFb(): void{
    var fb = new Fb();
    this.membre.fbmembre.push(fb);
  }

  async deleteLastFb(){
    var fb = this.membre.fbmembre.pop();
    console.log(this.membreService.suppresionElement(this.membreService.liste.fb, fb.id, fb));
  }

  async saveFbs(){
    this.membre.fbmembre.filter(obj => obj.id != undefined).forEach(async (fb)=>{
      fb = await this.membreService.updateElementById(this.membreService.liste.fb,fb.id,fb);
    })
    this.membre.fbmembre.filter(obj => obj.id == undefined).forEach(async (fb)=>{
      fb.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.fb,fb);
    })
  }

  addMail(): void{
    var mail = new Mail();
    this.membre.mailmembre.push(mail);
  }

  async deleteLastMail(){
    var mail = this.membre.mailmembre.pop();
    console.log(this.membreService.suppresionElement(this.membreService.liste.mail, mail.id, mail));
  }

  async saveMails(){
    this.membre.mailmembre.filter(obj => obj.id != undefined).forEach(async (mail) =>{
      mail = await this.membreService.updateElementById(this.membreService.liste.mail,mail.id,mail);
    })
    this.membre.mailmembre.filter(obj => obj.id == undefined).forEach(async (mail) =>{
      mail.membre = this.membre.id;
      await this.membreService.createElement(this.membreService.liste.mail,mail);
    })
  }
  
  async getAllStatut(){
    await this.membreService.getElementList(this.membreService.liste.statut).toPromise().then(
      data =>{
        this.liste_statut = data;
      }
    )
    if(this.id == 0){
      this.statut = this.liste_statut[0];
      this.membre.statut = this.statut;
    }else{
      this.statut = await this.membreService.getElementById(this.membreService.liste.statut, this.membre.statut.id);
    }
    console.log(this.membre);
  }

  async changeStatut(){
    if(this.modify_statut == true){
      this.statut = await this.membreService.updateElementById(this.membreService.liste.statut,this.statut.id, this.statut);
    }else{
      this.new_statut.poste = this.poste
      this.new_statut = await this.membreService.createElement(this.membreService.liste.statut, this.new_statut);
    }
    this.goToListeMembre();
  }

  modifierStatut(){
    this.change_statut = true;
    this.modify_statut = true;
  }

  onChangeStatut(){
    var statut = this.liste_statut.find(obj => obj.poste == this.statut.poste);
    this.membre.statut = statut;
  }

  async onCreateStatut(){
    this.change_statut = true;
    this.modify_statut = false;
  }

  async onDeleteLastStatut(){
    var statut = this.liste_statut.pop();
    console.log(statut);
    console.log(await this.membreService.suppresionElement(this.membreService.liste.statut, statut.id, statut));
  }

  async onDeleteStatut(){
    console.log(await this.membreService.suppresionElement(this.membreService.liste.statut, this.statut.id, this.statut));
  }

}
