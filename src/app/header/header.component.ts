import { Component, OnInit } from '@angular/core';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public id: number;
  public urlImage: string;
  public nom: string;
  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.membreService.setId(1);
    this.id = 1;
    this.getMembre();
    /*this.membreService.getProfil().subscribe(
      (data) =>{
        this.id = data['id'];
        this.urlImage = this.membreService.liste.base + data['photo'];
        this.nom = data['nom'];
      }
    );*/
  }

  async getMembre(){
    var membre = await this.membreService.getElementById(this.membreService.liste.membre,this.id);
    this.nom = membre.nom;
    var photo = await this.membreService.getElementById(this.membreService.liste.photoprofil,membre.photoprofil);
    this.urlImage = this.membreService.liste.base + photo.photo;
  }
}
