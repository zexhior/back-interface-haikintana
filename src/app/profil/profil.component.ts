import { Component, OnInit, Input} from '@angular/core';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  membre: Membre = null;

  urlImage: string = "http://127.0.0.1:8000";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "http://127.0.0.1:8000";

  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
  }

}
