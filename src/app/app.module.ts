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
import { HttpClientModule } from '@angular/common/http';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { WebcamModule } from 'ngx-webcam';
import { ProfilComponent } from './profil/profil.component';
import { PhotoComponent } from './photo/photo.component';
import { DetailActiviteComponent } from './detail-activite/detail-activite.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    WebcamModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
