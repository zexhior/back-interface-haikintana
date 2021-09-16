import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
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

  public chargement: boolean = false;

  public image: Image;

  public webcamImage: WebcamImage = null;
  public multipleWebcamAvailable = false;
  public deviceId: string;
  public switchCamera = true;
  public facingMode: string = 'environment';
  public errors: WebcamInitError[] = [];

  public message: string = "";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  constructor(private membreService: MembreService, private route: Router,
    private route_activate: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.position = this.route_activate.snapshot.params['pos'];
    /*this.mySub = interval(3000).subscribe(()=>{
      this.trigger.next();
    });*/
  }

  trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void{
    //this.mySub = interval(3000).subscribe(()=>{
      this.chargement = true;
      this.trigger.next();
    //});
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
          this.message = "Ce membre est introuvable. Veuillez réessayer";
          this.chargement = false;
        }else{
          this.membre = data;
          var presence = this.membre.presencemembre.find(data=> data.activite == this.position)
          if(presence == undefined){
            this.message = "Ce membre ne s'est pas inscrit";
            this.chargement = false;
          }else{
            if(presence.presence){
              this.message = "Ce membre est deja present";
              this.chargement = false;
            }else{
              presence.presence = true;
              presence = await this.membreService.updateElementById(this.membreService.liste.presence, presence.id, presence);
              this.route.navigate(['/manager/presence/'+this.membre.id]);
            }
            console.log("tada");
          }
        }
      }
    );
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints{
    const result: MediaTrackConstraints = {};
    if(this.facingMode && this.facingMode != ''){
      result.facingMode = {ideal: this.facingMode};
    }
    return result;
  }

  public handleInitError(error: WebcamInitError){
    if(error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError'){
      console.warn("La camera acces refusé");
    }
    this.errors.push(error);
  }
}
