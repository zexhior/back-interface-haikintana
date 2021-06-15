import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Liste } from './liste_element';

@Injectable({
  providedIn: 'root'
})

export class MembreService {
  public liste: Liste = new Liste;

  public element: any = null;

  private baseUrl = "http://127.0.0.1:8000/api";

  private id: number;

  constructor(private http: HttpClient) { 
    
  }

  setId(id: number){
    this.id = id;
  }

  getProfil(): any{
    return this.http.get(`${this.baseUrl}/membres/${this.id}`);
  }

  getElementList(path: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${path}/`);
  }

  async getElementById(path: string, id: number):Promise<any>{
    return await this.http.get(`${this.baseUrl}/${path}/${id}`).toPromise().then(
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

  analyseQRCode(urlImage: Object): Observable<any>{
    return this.http.post(`${this.baseUrl}/qrcode/`, urlImage);
  } 
}
