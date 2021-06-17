import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActiviteInfoComponent } from './activite-info/activite-info.component';
import { ActiviteComponent } from './activite/activite.component';
import { DetailActiviteComponent } from './detail-activite/detail-activite.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { MembreComponent } from './membre/membre.component';
import { PhotoComponent } from './photo/photo.component';
import { ProfilComponent } from './profil/profil.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ResultatComponent } from './resultat/resultat.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'manager', component: ManagerComponent,
    children: [
      {path: '', component: AccueilComponent},
      {path: 'resultat', component: ResultatComponent},
      {path: 'accueil', component: AccueilComponent},
      {path: 'activite', component: ActiviteComponent},
      {path: 'membre', component: MembreComponent},
      {path: 'qrcode', component: QrcodeComponent},
      {path: 'profil/:id', component: ProfilComponent},
      {path: 'detail-activite/:id', component: DetailActiviteComponent,
        children: [
          {path: '', component: ActiviteInfoComponent},
          {path: 'activite-info', component: ActiviteInfoComponent},
          {path: 'photo', component: PhotoComponent}
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }