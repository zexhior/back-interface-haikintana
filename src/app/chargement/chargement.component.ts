import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chargement',
  templateUrl: './chargement.component.html',
  styleUrls: ['./chargement.component.scss']
})
export class ChargementComponent implements OnInit {
  @Input() chargement:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
