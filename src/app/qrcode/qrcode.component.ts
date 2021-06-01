import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { Image } from '../image';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})

export class QrcodeComponent implements OnInit {
  mySub: Subscription;

  private router: Router;

  public nombre: number = 0;

  public image: Image;

  public webcamImage: WebcamImage = null;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private membreService: MembreService) {
  }

  ngOnInit(): void {
    this.mySub = interval(3000).subscribe(()=>{
      this.trigger.next();
    });
  }

  trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void{
    this.mySub = interval(3000).subscribe(()=>{
      this.nombre++;
      this.trigger.next();
    });
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
          
        }
      }
    );
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }
}