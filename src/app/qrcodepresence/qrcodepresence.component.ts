import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { Image } from '../image';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { Presence } from '../presence';

@Component({
  selector: 'app-qrcodepresence',
  templateUrl: './qrcodepresence.component.html',
  styleUrls: ['./qrcodepresence.component.scss']
})
export class QrcodepresenceComponent implements OnInit {
  private mySub: Subscription;

  public teste_membre: boolean = false;

  private membre: Membre;

  public position: number = 0;

  public image: Image;

  public webcamImage: WebcamImage = null;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private membreService: MembreService, private route: Router,
    private route_activate: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.position = this.route_activate.snapshot.params['pos'];
    this.mySub = interval(3000).subscribe(()=>{
      this.trigger.next();
    });
  }

  trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void{
    this.mySub = interval(3000).subscribe(()=>{
      this.trigger.next();
    });
  }
  
  async handleImage(webcamImage): Promise<void>{
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.image= new Image();
    this.image.image = this.webcamImage.imageAsDataUrl;
    await this.membreService.analyseQRCode(this.image).toPromise().then(
      async data =>{
        console.log("Data enregistrer");
        if(data == ""){
          console.log("none");
        }else{
          this.membre = data;
          console.log(this.membre);
          for(let presencemembre of this.membre.presencemembre){
            var verification = await this.membreService.getElementById(this.membreService.liste.presence,presencemembre.id);
            if(verification.activite == this.position){
              this.teste_membre = true;
            }else{
              this.teste_membre = false;
            }
          }
          if(this.teste_membre == false){
            var presence = new Presence();
            presence.presence=true;
            presence.contrepersence=false;
            presence.activite = this.position;
            presence.membre = this.membre.id;
            presence = await this.membreService.createElement(this.membreService.liste.presence,presence);
            if(presence){
              console.log(presence);
              this.route.navigate(['/manager/presence/'+this.membre.id]);
            }
          }
        }
      }
    );
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }
}
