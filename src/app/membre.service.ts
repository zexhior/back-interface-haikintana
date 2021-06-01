import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fb } from './fb';
import { Liste } from './liste_element';
import { Mail } from './mail';
import { Membre } from './membre';
import { Numero } from './numero';

@Injectable({
  providedIn: 'root'
})

export class MembreService {
  public liste: Liste = new Liste;

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

  analyseQRCode(urlImage: Object): Observable<any>{
    return this.http.post(`${this.baseUrl}/qrcode/`, urlImage);
  } 
}
