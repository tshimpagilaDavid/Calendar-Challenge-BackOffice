import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';
import { CreateComponent } from './create/create.component';
import { FormationComponent } from './formation/formation.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { EntrepriseDetailsComponent } from './entreprise-details/entreprise-details.component';



const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'dashboard', component: DashboardComponent }, // Route pour la page "À propos"
  { path: 'create', component: CreateComponent }, // Route pour la page "À propos"
  { path: 'profil', component: ProfilComponent }, // Route pour la page "À propos"
  { path: 'formation', component: FormationComponent }, // Route pour la page "À propos"
  { path: 'entreprise', component: EntrepriseComponent }, // Route pour la page "À propos"
  { path: 'entreprise/:id', component: EntrepriseDetailsComponent }, // Route pour la page "À propos"
  { path: '**', redirectTo: '' } // Redirection pour les routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
