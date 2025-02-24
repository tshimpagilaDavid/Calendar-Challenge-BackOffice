import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms'; // Importez FormsModule ici
import { MatSnackBarModule } from '@angular/material/snack-bar';


// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './create/create.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { EntrepriseDetailsComponent } from './entreprise-details/entreprise-details.component';
import { ProfilComponent } from './profil/profil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormationComponent } from './formation/formation.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    CreateComponent,
    EntrepriseComponent,
    EntrepriseDetailsComponent,
    ProfilComponent,
    FormationComponent
  ],
  imports: [
    MatSnackBarModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [// Ajoutez les fournisseurs Firebase ici
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),],
  bootstrap: [AppComponent]
})
export class AppModule { }
