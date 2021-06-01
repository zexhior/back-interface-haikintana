import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActiviteComponent } from './activite/activite.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { MembreComponent } from './membre/membre.component';
import { ProfilComponent } from './profil/profil.component';
import { QrcodeComponent } from './qrcode/qrcode.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'manager/', component: AccueilComponent},
  {path: 'manager', component: ManagerComponent},
  {path: 'accueil', component: AccueilComponent},
  {path: 'activite', component: ActiviteComponent},
  {path: 'membre', component: MembreComponent},
  {path: 'qrcode', component: QrcodeComponent},
  {path: 'profil/:id', component: ProfilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
