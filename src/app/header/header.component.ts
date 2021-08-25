import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Membre } from '../membre';
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
  constructor(private membreService: MembreService, 
    private auth_service: AuthService,
    private route: Router) {
    this.getMembre();
  }

  ngOnInit(): void {
    this.getMembre();
  }

  async getMembre(){
    var membre = await this.membreService.getProfil<Membre>();
    this.nom = membre.last_name;
    this.id = membre.id;
    var photo = membre.photoprofil.photo;
    this.urlImage = this.membreService.liste.base + photo;
  }

  logout(){
    this.auth_service.logout();
    this.route.navigate(['/login']);
  }
}
