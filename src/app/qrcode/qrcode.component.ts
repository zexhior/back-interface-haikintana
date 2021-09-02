import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { Image } from '../image';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})

export class QrcodeComponent implements OnInit {
  private mySub: Subscription;

  private membre: Membre;

  public image: Image;

  public webcamImage: WebcamImage = null;
  public multipleWebcamAvailable = false;
  public deviceId: string;
  public switchCamera = true;
  public facingMode: string = 'environment';
  public errors: WebcamInitError[] = [];
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public showWebcam = true;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";

  trigger: Subject<void> = new Subject<void>();

  constructor(private membreService: MembreService, private route: Router,
    private route_activate: ActivatedRoute) {
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[])=>{
      this.multipleWebcamAvailable = mediaDevices && mediaDevices.length > 1;
    })
  }

  triggerSnapshot(): void{
    //this.mySub = interval(3000).subscribe(()=>{
      this.trigger.next();
    //});
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
          this.route.navigate(['/manager/profil/'+this.membre.id]);
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

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleInitError(error: WebcamInitError){
    if(error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError'){
      console.warn("La camera acces refusé");
    }
    this.errors.push(error);
  }
}