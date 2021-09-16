import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;

  public refresh_token: string;

  public httpOptions: any;

  private baseUrl = "https://haikintana-api.herokuapp.com/api";
  //private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders(
        {'Content-Type': 'application/json'}  
      )
    }
  }

  updateToken(token){
    localStorage.setItem('token_refresh','0');
    localStorage.setItem('token', token);
    this.token = token;
  }

  updateRefreshToken(token){
    localStorage.setItem('token_refresh','1');
    localStorage.setItem('refresh',token);
    this.refresh_token = token;
  }

  async login(user){
    var element = JSON.stringify(user);
    await this.http.post(`${this.baseUrl}/token/`,element,this.httpOptions).toPromise().then(
      async (data) => {
        this.updateToken(data['access']);
        this.updateRefreshToken(data['refresh']);
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout(){
    this.deleteToken();
  }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refresh');
  }

  deleteToken(){
    localStorage.clear();
  }
}