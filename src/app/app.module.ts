import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccueilComponent } from './accueil/accueil.component';
import { MembreComponent } from './membre/membre.component';
import { ActiviteComponent } from './activite/activite.component';
import { RechercheComponent } from './recherche/recherche.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { WebcamModule } from 'ngx-webcam';
import { ProfilComponent } from './profil/profil.component';
import { PhotoComponent } from './photo/photo.component';
import { DetailActiviteComponent } from './detail-activite/detail-activite.component';
import { ResultatComponent } from './resultat/resultat.component';
import { PresenceComponent } from './presence/presence.component';
import { QrcodepresenceComponent } from './qrcodepresence/qrcodepresence.component';
import { MembreService } from './membre.service';
import { TokenInterceptorService} from './token-interceptor.service';
import { AuthService } from './auth.service';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule} from '@angular/material/slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManagerComponent,
    HeaderComponent,
    FooterComponent,
    AccueilComponent,
    MembreComponent,
    ActiviteComponent,
    RechercheComponent,
    QrcodeComponent,
    ProfilComponent,
    PhotoComponent,
    DetailActiviteComponent,
    ResultatComponent,
    PresenceComponent,
    QrcodepresenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    WebcamModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    MatSliderModule,
    NgbModule,
  ],
  providers: [
    MembreService, 
    AuthService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
