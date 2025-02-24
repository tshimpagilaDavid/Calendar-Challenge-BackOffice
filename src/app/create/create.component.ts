import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Location } from '@angular/common';


@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  showTable: boolean = false;
  entrepriseNom: string = '';
  entrepriseSecteur: string = '';
  entrepriseLogo: string = '';

  constructor(private router: Router, private firestore: Firestore,private location: Location) {}

  uploadImage() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.entrepriseLogo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  goBack() {
    this.location.back(); // Utilise le service Location d'Angular pour revenir à la page précédente
  }
  

  goToFormations() {
    this.router.navigate(['/formation']);
  }

  toggleEntrepriseForm() {
    this.showTable = !this.showTable;
  }

  async addEntreprise() {
    if (this.entrepriseNom && this.entrepriseSecteur && this.entrepriseLogo) {
      const entrepriseRef = doc(collection(this.firestore, 'entreprises'), this.entrepriseNom);
      try {
        await setDoc(entrepriseRef, {
          nom: this.entrepriseNom,
          secteur: this.entrepriseSecteur,
          logo: this.entrepriseLogo
        });
        alert('Entreprise ajoutée avec succès');
        this.entrepriseNom = '';
        this.entrepriseSecteur = '';
        this.entrepriseLogo = '';
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'entreprise :", error);
      }
    } else {
      alert('Veuillez remplir tous les champs');
    }
  }
}