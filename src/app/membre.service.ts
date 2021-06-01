import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fb } from './fb';
import { Mail } from './mail';
import { Membre } from './membre';
import { Numero } from './numero';

@Injectable({
  providedIn: 'root'
})

export class MembreService {
  private element: any = null;

  private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { }

  getElementList(path: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${path}/`);
  }

  getElementById(path: string, id: number): any{
    return this.http.get(`${this.baseUrl}/${path}/${id}`);
  }

  getBaseUrlImage(): string{
    return "http://127.0.0.1:8000";
  }

  /*getMembreList() : Observable<any>{
    return this.http.get(`${this.baseUrl}/membres/`);    
  }

  getMembreById(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/membres/${id}`);
  }

  getNumeroById(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/numeros/${id}`);
  }

  getNumerosList(): Observable<any>{ 
    return this.http.get(`${this.baseUrl}/numeros/`);
  }

  getMailById(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/mails/${id}`);
  }

  getMailList(): Observable<any>{ 
    return this.http.get(`${this.baseUrl}/mails/`);
  }

  getFbById(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/fbs/${id}`);
  }

  getFbList(): Observable<any>{ 
    return this.http.get(`${this.baseUrl}/fbs/`);
  }*/

  analyseQRCode(urlImage: Object): Observable<any>{
    return this.http.post(`${this.baseUrl}/qrcode/`, urlImage);
  } 
}
