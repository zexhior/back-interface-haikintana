import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Image } from '../image';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  public image: Image;

  public membre: Membre = null;

  urlImage: string = "http://127.0.0.1:8000";

  public webcamImage: WebcamImage = null;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private membreService: MembreService) {}

  ngOnInit(): void {
    
  }

  trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void{
    this.trigger.next();
  }
  
  handleImage(webcamImage): void{
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.image= new Image();
    this.image.image = this.webcamImage.imageAsDataUrl;
    this.membreService.analyseQRCode(this.image).subscribe(
      data =>{
        console.log("Data enregistrer");
        if(data == ""){
          console.log("none");
        }else{
          this.membre = data;
          this.urlImage = this.urlImage + this.membre.photo;
          this.value = this.membre.id + "*" + this.membre.nom + "*" + 
          this.membre.prenom + "*" +  this.membre.photo + "*" + this.membre.statut; 
        }
      }
    );
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }
}