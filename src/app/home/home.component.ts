import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Connexion réussie :', userCredential.user);
      this.router.navigate(['/dashboard']); // Redirige vers le tableau de bord
    } catch (error) {
      console.error('Erreur de connexion :', error);
      alert('Erreur de connexion. Vérifiez vos identifiants.');
    }
  }

}
