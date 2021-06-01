import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.scss']
})
export class MembreComponent implements OnInit {
  public listeMembre: Observable<Membre[]>;

  constructor(private membreService: MembreService) { }

  ngOnInit(): void {
    this.listeMembre = this.membreService.getElementList(this.membreService.liste.membre);
    console.log(this.listeMembre);
  }
}
