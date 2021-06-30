import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit{

  constructor() {
  }

  ngOnInit(): void {
    if(localStorage.getItem('body') == 'image'){
      location.reload();
      localStorage.removeItem('body');
    }
    document.body.style.backgroundColor = "rgb(240, 240, 240)";
  }

}
