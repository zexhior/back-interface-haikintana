import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActiviteComponent } from './activite/activite.component';
import { DetailActiviteComponent } from './detail-activite/detail-activite.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { MembreComponent } from './membre/membre.component';
import { PresenceComponent } from './presence/presence.component';
import { ProfilComponent } from './profil/profil.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { QrcodepresenceComponent } from './qrcodepresence/qrcodepresence.component';
import { ResultatComponent } from './resultat/resultat.component';
import { AuthGuard} from './auth-guard.service'
import { OtherGuard } from './other-guard.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent,canActivate: [AuthGuard],},
  {path: 'manager', component: ManagerComponent,
    canActivate: [OtherGuard],
    children: [
      {path: '', component: AccueilComponent,},
      {path: 'resultat', component: ResultatComponent},
      {path: 'accueil', component: AccueilComponent},
      {path: 'activite', component: ActiviteComponent},
      {path: 'membre', component: MembreComponent},
      {path: 'qrcode', component: QrcodeComponent},
      {path: 'qrcodepresence/:pos', component: QrcodepresenceComponent},
      {path: 'profil/:id', component: ProfilComponent},
      {path: 'detail-activite/:id', component: DetailActiviteComponent},
      {path: 'presence/:id', component: PresenceComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }