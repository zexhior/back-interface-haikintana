import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Membre } from '../membre';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: '';
  public pwd: '';
  public message: string = "";
  private user : any;
  constructor(private membreService: MembreService,
    private authService: AuthService,
    private route: Router,
    private elementRef: ElementRef) { }

  ngOnInit(): void {
    //document.body.style.backgroundImage = "url(../assets/background.png)";
  }

  async authentification(){
    var element = {"username":this.username,"pwd":this.pwd};
    var test = await this.membreService.authentification(this.membreService.liste.authentification, element);
    if(test['reponse']==true){
      console.log("user: "+test['usertoken']);
      await this.goToMain(test['id'],test['username']);
    }
    else{
      this.message = test['raison'];
    }
  }

  async goToMain(id: number,username: string){
    this.membreService.setId(id);
    await this.authService.login({'username': username,'password': this.pwd});
  }
}
