import { Component } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarOpen: boolean = false; // Menu ouvert par défaut
  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.router.navigate(['/']); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      }
    });
  }
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }
  // Basculer l'état du menu (ouvert/fermé)
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
