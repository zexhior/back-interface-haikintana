import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Image } from '../image';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  public image: Image;

  public text: string;

  public webcamImage: WebcamImage = null;

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
        this.text = data;
        console.log(data);
      }
    );
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }
}