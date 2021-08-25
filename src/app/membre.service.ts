import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CastExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Liste } from './liste_element';
import { Membre } from './membre';

@Injectable({
  providedIn: 'root'
})

export class MembreService {
  public urlImage: string = "http://127.0.0.1:8000";

  public liste: Liste = new Liste;

  public element: any = null;

  private baseUrl = "http://127.0.0.1:8000/api";

  private id: number;

  private membre: Membre;

  constructor(private http: HttpClient, private route:Router) { 
  
  }

  setId(id: number){
    this.id = id;
    localStorage.setItem("id",""+this.id);
  }

  async getProfil<type>(): Promise<type>{
    this.id = Number.parseInt(localStorage.getItem("id"));
    return await this.http.get<type>(`${this.baseUrl}/membres/${this.id}`).toPromise().then(
      data => {
        return data;
      }
    );
  }

  getElementList(path: string): any{
    return this.http.get(`${this.baseUrl}/${path}/`);
  }

  async getElementById(path: string, id: number):Promise<any>{
    return await this.http.get(`${this.baseUrl}/${path}/${id}`).toPromise().then(
      data => {
        return data;
      }
    );
  }

  async updateElementById(path: string, id: number, element: Object):Promise<any>{
    return await this.http.put(`${this.baseUrl}/${path}/${id}`, element).toPromise().then(
      data => {
        return data;
      }
    );
  }

  async createElement(path: string,element: Object) : Promise<any>{
    return this.http.post(`${this.baseUrl}/${path}/`,element).toPromise().then(
      (data) => {
        return data;
      }
    );
  }

  async suppresionElement(path: string,id:number, element: Object) : Promise<any>{
    return this.http.delete(`${this.baseUrl}/${path}/${id}`,element).toPromise().then(
      (data) => {
        return data;
      }
    )
  }

  async authentification(path: string,data: any){
    return this.http.post(`${this.baseUrl}/${path}/`,data).toPromise().then(
      data => {
        return data;
      }
    )
  }

  analyseQRCode(urlImage: Object): Observable<any>{
    return this.http.post(`${this.baseUrl}/qrcode/`, urlImage);
  } 

  async savePhotoProfil(formData){
    await this.http.post(`${this.baseUrl}/membrecreation/`,formData).toPromise().then(
          data =>{ 
            console.log("test");
            console.log(data);
          }
        );
  }

  async updatePhotoProfil(formData){
    await this.http.put(`${this.baseUrl}/membrecreation/`,formData).toPromise().then(
          data =>{ 
            console.log("test");
            console.log(data);
          }
        );
  }

  getActiviteFilter(path:string, categorie: string): any{
    return this.http.get(`${this.baseUrl}/${path}/${categorie}`);
  }

  getMembreFilter(path:string, statut:string): any{
    return this.http.get(`${this.baseUrl}/${path}/${statut}`);
  }
}
