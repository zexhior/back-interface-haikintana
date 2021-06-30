import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';
import { PhotoProfil } from '../photoprofil';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
  
  public id: number;
  public membre: Membre;
  public urlImage: string;

  constructor(private membresService: MembreService, 
    private route_activated: ActivatedRoute) { 

  }

  async ngOnInit(): Promise<void> {
    this.id = this.route_activated.snapshot.params['id'];
    this.membre = await this.membresService.getElementById(this.membresService.liste.membre,this.id);
    this.urlImage = this.membresService.urlImage + this.membre.photoprofil.photo;
    console.log(this.membre.presencemembre);
  }

}
