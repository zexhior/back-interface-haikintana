import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActiviteComponent } from './activite/activite.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { MembreComponent } from './membre/membre.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'manager', component: ManagerComponent},
  {path: 'accueil', component: AccueilComponent},
  {path: 'activite', component: ActiviteComponent},
  {path: 'membre', component: MembreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
