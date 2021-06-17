import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembreService } from '../membre.service';
import { Photo } from '../photo';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})

export class PhotoComponent implements OnInit {
  
  @Input() ids: number[];
  @Input() nbr: number = 0;
  public photos = new Array<File>();
  public urlPhotos = new Array<any>();

  constructor(private membreService: MembreService, private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    /*for(let id of this.ids){
      this.membreService.getElementById(this.membreService.liste.photo, id).subscribe(
        (data) => {
          this.photos.push(this.membreService.liste.base + data.url_image);
        }
      );
      if(this.nbr == 1){
        break;
      }
    }*/
  }

  addImage(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event)=>{
      this.urlPhotos.push(reader.result);
    }
    this.photos.push(file);
  }
}
