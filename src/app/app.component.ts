import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';  // Importer les fonctions Firebase
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Calendar-challenge2';
  private auth = getAuth();  // Initialiser l'authentification Firebase
  constructor(private router: Router) {}

  ngOnInit() {
    // Surveiller l'état de connexion
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Si l'utilisateur est connecté, rediriger vers la page principale (par exemple "dashboard")
        this.router.navigate(['/dashboard']);
      } else {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        this.router.navigate(['/home']);
      }
    });
  }
}
