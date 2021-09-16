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
import { Activite } from '../activite';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  liste: Liste = new Liste;
  id: number;
  membre: Membre = new Membre();
  current_membre: Membre = new Membre();
  public file: File;
  public photoprofil: PhotoProfil = null;
  public liste_statut = new Array<Statut>();
  public statut = new Statut();
  public change_statut: boolean = false;
  public modify_statut: boolean = false;
  public poste: string;
  public firstpwd: string;
  public message_mdp: string;
  public mdp: string;
  public listeActivite: Array<Activite> = new Array<Activite>();
  public modificationInfo: boolean = false;
  public modificationContact: boolean = false;
  public modificationLocalisation: boolean = false;
  public modificationStatut: boolean = false;
  public is_staff: boolean = false;
  public is_current_membre: boolean = true;
  public current_id: number;
  public chargement:boolean = true;

  private onChangeProfil: boolean = false;
  private formData = new FormData();
  private new_statut = new Statut();

  urlImage: string = this.membreService.urlImage;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private http: HttpClient , 
    private membreService: MembreService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private routeLink: Router, private changeDetection: ChangeDetectorRef) { 
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.params['id'];
    await this.getAllStatut();
    if(this.id != 0){
      await this.getMembre();
      if(this.membre.fbmembre.length == 0){
        this.membre.fbmembre.push(new Fb());
      }
      if(this.membre.nummembre.length == 0){
        this.membre.nummembre.push(new Numero());
      }
    }
    else{
      this.membre.username = "Pseudo";
      this.membre.last_name = "Nom";
      this.membre.first_name = "Prénom";
      this.membre.adr_phys = "Adresse";
      this.membre.email = "Email@email.com";
      this.membre.mailmembre = [];
      this.membre.fbmembre = [];
      this.membre.nummembre = [];
      this.membre.nummembre.push(new Numero());
      this.membre.fbmembre.push(new Fb());
      this.statut = this.liste_statut[0];
      this.membre.statut = this.statut;
      console.log('create'+this.statut.poste);
    }
    var membre = await this.membreService.getProfil<Membre>();
    this.is_staff = membre.statut.is_staff;
    this.current_id = membre.id;
    if(this.id == this.current_id){
      this.is_current_membre = true;
    }else{
      this.is_current_membre = false;
    }
    this.chargement = false;
  }

  

  async getMembre(): Promise<void>{
    this.current_membre = await this.membreService.getProfil();
    this.membre = await this.membreService.getElementById(this.liste.membre,this.id);
    for(let presence of this.membre.presencemembre){
      this.listeActivite.push(await this.membreService.getElementById(this.membreService.liste.activite, presence.activite));
    }
    if(this.membre.photoprofil != undefined){
      this.urlImage = this.urlImage + this.membre.photoprofil.photo;
      this.value = this.membre.id+"*"+this.membre.last_name+
      "*"+this.membre.first_name+"*"+this.membre.photoprofil+"*";+this.membre.statut;
      this.statut = this.membre.statut;
    }else{
      this.value = this.membre.id+"*"+this.membre.last_name+
      "*"+this.membre.first_name+"*NULL*";+this.membre.statut;
      this.statut = this.membre.statut;
    }
  }

  /*---------------------- Manipulation des informations du membre----------------------------------- */

  async callServiceToSaveMembre(): Promise<void>{
    if(this.id == 0){
      console.log("create membre");
      this.membre.id = (await this.membreService.createElement(this.membreService.liste.membre, this.membre)).id;
      console.log(this.membre);
      await this.saveNumeros();
      await this.saveFbs();
      await this.saveMails();
      this.callServiceToSavePhoto();
    }
    else{
      console.log("update membre");
      await this.saveNumeros();
      await this.saveFbs();
      await this.saveMails();
      this.callServiceToSavePhoto();
      if(this.membre.password == undefined){
        this.membre.password = "a";
      }
      var membre = await this.membreService.updateElementById(this.membreService.liste.membre, this.id, this.membre);
    }
  }

  /*---------------------- Retour vers la liste des membres----------------------------------- */

  goToListeMembre(){
    this.routeLink.navigate(['/manager/membre']);
  }


  /*---------------------- Sauvegarde des données----------------------------------- */

  async save(){
    if(this.id == 0){
      if(this.membre.password != undefined && this.membre.password.length > 7){
        if(this.firstpwd == this.membre.password){
          await this.callServiceToSaveMembre();
        }else{
          this.message_mdp = "Les deux mot de passe ne se correspondent pas";
        }
      }
      else{
        this.message_mdp = "Mot de passe trop court";
      }
    }
    else{
      await this.callServiceToSaveMembre();
    }
    this.goToListeMembre();
  }

  onSubmit(){
    this.save();
  }

  /*---------------------- manipulation du photo de profil----------------------------------- */

  async callServiceToSavePhoto(){
    console.log("save photo");
    console.log(this.membre.photoprofil);
    if(this.onChangeProfil){
      this.formData.append('photo', this.membre.photoprofil.photo,this.membre.last_name+"_"+this.membre.first_name+".jpg");
      this.formData.append('membre',""+this.membre.id);
      if(this.membre.photoprofil.id === undefined){
        console.log("create photo :");
        var photo = await this.membreService.savePhotoProfil(this.formData);
      }
      else{
        console.log("udpate photo :");
        console.log(this.membre.photoprofil);
        this.formData.append('id',this.membre.photoprofil.id.toString());
        var photo = await this.membreService.updatePhotoProfil(this.formData);
      }
    }
  }

  getImage(event){
    if(this.membre.photoprofil == undefined){
      this.membre.photoprofil = new PhotoProfil();
    }
    this.onChangeProfil = true;
    this.membre.photoprofil.photo = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.membre.photoprofil.photo);
    reader.onload = (_event)=>{
      this.urlImage = reader.result.toString();
      console.log(this.membre.photoprofil);
    }
  }

  /*---------------------- manipulation des numeros----------------------------------- */

  addNum(): void{
    var num = new Numero();
    this.membre.nummembre.push(num);
  }

  async deleteNum(numero:Numero){
    var num = this.membre.nummembre.splice(this.membre.nummembre.findIndex(data => data == numero),1);
    if(numero.id != undefined){
      console.log(this.membreService.suppresionElement(this.membreService.liste.numero, numero.id, numero));
    }
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

  /*---------------------- manipulation des comptes fb----------------------------------- */

  addFb(): void{
    var fb = new Fb();
    this.membre.fbmembre.push(fb);
  }

  async deleteFb(fb:Fb){
    var compte = this.membre.fbmembre.splice(this.membre.fbmembre.findIndex(data=>data==fb),1);
    if(fb.id != undefined){
      console.log(this.membreService.suppresionElement(this.membreService.liste.fb, fb.id, fb));
    }
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

  /*---------------------- manipulation des mails----------------------------------- */

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

  /*---------------------- manipulation des status----------------------------------- */
  
  async getAllStatut(){
    await this.membreService.getElementList(this.membreService.liste.statut).toPromise().then(
      data =>{
        this.liste_statut = data;
        console.log(this.liste_statut);
      }
    );
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

  /*---------- mode modification ----------*/
  modifierInfo(){
    if(this.modificationInfo){
      this.modificationInfo = false;
    }else{
      this.modificationInfo = true;
    }
  }

  modifierContact(){
    if(this.modificationContact){
      this.modificationContact = false;
    }else{
      this.modificationContact = true;
    }
  }

  modifierLocalisation(){
    if(this.modificationLocalisation){
      this.modificationLocalisation = false;
    }else{
      this.modificationLocalisation = true;
    }
  }

  modifierStatutMode(){
    if(this.modificationStatut){
      this.modificationStatut = false;
    }else{
      this.modificationStatut = true;
    }
  }
}
