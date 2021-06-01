import { Component, OnInit, Input} from '@angular/core';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute } from '@angular/router';
import { Liste } from '../liste_element';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  liste: Liste = new Liste;
  id: number = 2;
  membre: Membre = null;

  urlImage: string = "http://127.0.0.1:8000";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private membreService: MembreService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log("id:"+this.id);
    this.membreService.getElementById(this.liste.membre,this.id).subscribe(
      (data) => {
        this.membre = data;
        this.urlImage = this.urlImage + this.membre.photo;
        this.value = this.membre.id+"*"+this.membre.nom+
        "*"+this.membre.prenom+"*"+this.membre.photo+"*"+this.membre.statut;
      }
    );
    console.log(this.membre.nom);
  }
}
