import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Membre } from './membre';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;

  public httpOptions: any;

  private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders(
        {'Content-Type': 'application/json'}  
      )
    }
  }

  creationUser(id: number,mail: string){
    var idmail = {'id': id,'mail': mail};
    return this.http.post(`${this.baseUrl}/creation/`,idmail).subscribe(
      data => {
        return data;
      }
    );
  }

  updateUser(membre: Membre, mail: string){
    /*var idmail = {'id': id,'mail': mail};
    return this.http.put(`${this.baseUrl}/creation/`,idmail).subscribe(
      data => {
        return data;
      }
    );*/
  }

  async getUser(id: number, mail:string, nom:string){
    var user = new User();
    user.id = id;
    user.username = nom;
    user.email = mail;
    return await this.http.post(`${this.baseUrl}/get_user/`,user).toPromise().then(
      data => {
        return data;
      }
    );
  }

  updateToken(token){
    this.token = token;
  }

  async login(user){
    var element = JSON.stringify(user);
    return this.http.post(`${this.baseUrl}/token/`,element,this.httpOptions).toPromise().then(
      (data) => {
        this.updateToken(data['token']);
        localStorage.setItem('token', this.token);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  logout(){
    localStorage.clear();
  }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
