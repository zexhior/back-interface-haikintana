import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MembreService {

  private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { }

  analyseQRCode(urlImage: Object): Observable<any>{
    return this.http.post(`${this.baseUrl}/qrcode/`, urlImage);
  }
  
}
