import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  private is_refreshing = false;
  //private baseUrl = "https://haikintana-api.herokuapp.com/api"; 
  private baseUrl = "http://127.0.0.1:8000/api";

  constructor(private authService: AuthService, private httpClient: HttpClient) { }
  
  intercept(req: HttpRequest<any>, next:HttpHandler): any{
    if(this.authService.getToken()){
      req = this.addToken(req, this.authService.getToken())
    }
    return next.handle(req).pipe(catchError(error => {
          if(error instanceof HttpErrorResponse && error.status === 401){
            return this.handler401Error(req, next);
          }else{
            return throwError(error);
          }
        }
      )
    );
  }

  private addToken(request: HttpRequest<any>, token: string){
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }  
    });
  }

  private async handler401Error(request: HttpRequest<any>, next: HttpHandler){
    if(!this.is_refreshing){
      this.is_refreshing = true;
      await this.httpClient.post(`${this.baseUrl}/token/refresh/`,{"refresh" : this.authService.getRefreshToken()}).toPromise().then(
        async data => {
          this.is_refreshing = false;
          console.log("data: " + data);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          this.authService.updateToken(data['access']);
          this.authService.updateRefreshToken(data['refresh']);
          location.reload();
        }
      );
    } 
    return next.handle(this.addToken(request, this.authService.getToken()));
  }
}
