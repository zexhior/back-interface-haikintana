import { Component, Input, OnInit, Testability } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Activite } from '../activite';
import { Categorie } from '../categorie';
import { MembreService } from '../membre.service';

@Component({
  selector: 'app-activite-info',
  templateUrl: './activite-info.component.html',
  styleUrls: ['./activite-info.component.scss']
})
export class ActiviteInfoComponent implements OnInit {
  public activite: Activite = null;
  public paragraphes= new Array<string>();
  public listeCategorie: Observable<Array<Categorie>>;
  public theme: string;
  public date: string;
  public addCategorie: boolean = false;
  public type: string;
  private idCategorie: number;
  public categorie: Categorie = null;
  private id: number;
  public selected: any;

  constructor(private membreService: MembreService, private route: ActivatedRoute,
    private routeNavigate: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getActivite();
    this.listeCategorie = this.membreService.getElementList(this.membreService.liste.categorie);
    this.listeCategorie.subscribe((data)=>{
      this.selected = data[0].type;
    });
    /*this.membreService.getElementById(this.membreService.liste.activite,this.id).subscribe(
      (data) => {
        this.activite = data;
        for(let id of this.activite.descriptions){
          this.membreService.getElementById(this.membreService.liste.description, id).subscribe(
            (element) => {
              this.paragraphes.push(element.paragraphe);
              console.log(element);
            }
          );
        }
      }
    );*/
  }

  async getActivite(): Promise<void>{
    this.activite = await this.membreService.getElementById(this.membreService.liste.activite,this.id)
    for(let id of this.activite.descriptions){
      this.paragraphes.push(await this.membreService.getElementById(this.membreService.liste.description, id));
    }
  }

  async save(){
    console.log("tada");
    this.activite = new Activite();
    this.activite.theme = this.theme;
    this.activite.date = this.date;
    await this.listeCategorie.toPromise().then(
      data => {
        for(let categorie of data){
          if(categorie.type == this.selected){
            this.activite.categorie = categorie.id;
            console.log(categorie.id);
          }
        }
      }
    );
    this.activite = await this.membreService.createElement(this.membreService.liste.activite, this.activite);
    console.log(this.activite);
  }

  onSubmit(){
    this.save();
  }

  async onSelectedCategorie(){
    console.log(this.selected);
  }

  onChangeCategorie(): void{
    this.addCategorie = true;
  }

  async modifierCategorie(): Promise<void>{
    if(this.categorie == null){
      this.categorie = new Categorie;
      this.categorie.type = this.type;
      this.categorie = await this.membreService.createElement(this.membreService.liste.categorie, this.categorie);
      console.log(this.categorie);
      this.routeNavigate.navigate(['/manager/activite'])
    }
  }
}
