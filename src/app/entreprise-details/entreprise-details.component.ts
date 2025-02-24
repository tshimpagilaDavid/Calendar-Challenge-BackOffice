import { Component, OnInit, Input } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, addDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';



interface Employe {
  id?: string;
  nom: string;
  email: string;
  role: string;
  uid?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-entreprise-details',
  templateUrl: './entreprise-details.component.html',
  styleUrls: ['./entreprise-details.component.scss'],
  standalone: false
})
export class EntrepriseDetailsComponent implements OnInit {
  @Input() entrepriseId!: string;  // ID de l'entreprise
  employes$!: Observable<Employe[]>;  // Liste des employés
  employesCount$!: Observable<number>;  // Nombre d'employés

  newNom = '';
  newEmail = '';
  newRole = '';
  newPassword = '';
  previewImage: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,private location: Location
  ) {}
  goBack() {
    this.location.back(); // Utilise le service Location d'Angular pour revenir à la page précédente
  }


  ngOnInit() {
    // Récupérer l'ID de l'entreprise depuis le paramètre de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error("ID de l'entreprise manquant !");
      return;
    }
    this.entrepriseId = id;

    const employesCollection = collection(this.firestore, `entreprises/${this.entrepriseId}/employes`);
    this.employes$ = collectionData(employesCollection, { idField: 'id' }) as Observable<Employe[]>;
    this.employesCount$ = this.employes$.pipe(map(employes => employes.length));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  showSnackbar(message: string, action: string, color: 'success' | 'error') {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [color]
    });
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Empêche la soumission par défaut qui peut recharger la page
    this.addEmploye();
  }
  

  async addEmploye() {
    if (!this.entrepriseId) {
      console.error("ID de l'entreprise non défini !");
      this.showSnackbar("Erreur : ID de l'entreprise non défini.", 'Fermer', 'error');
      return;
    }
  
    if (!this.newNom || !this.newEmail || !this.newRole || !this.newPassword) {
      this.showSnackbar("Tous les champs sont obligatoires !", 'Fermer', 'error');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.newEmail, this.newPassword);
      const user = userCredential.user;
  
      let photoBase64 = 'assets/default-avatar.png';
      if (this.previewImage) {
        photoBase64 = this.previewImage;
      }
  
      // Création du document dans la sous-collection "employes" de l'entreprise
      const employesCollection = collection(this.firestore, `entreprises/${this.entrepriseId}/employes`);
      await addDoc(employesCollection, {
        uid: user.uid,
        nom: this.newNom,
        email: this.newEmail,
        role: this.newRole,
        photoUrl: photoBase64
      });
  
      this.showSnackbar("Employé ajouté avec succès !", 'Fermer', 'success');
  
      // Réinitialisation des champs
      this.newNom = '';
      this.newEmail = '';
      this.newRole = '';
      this.newPassword = '';
      this.previewImage = null;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé :", error);
      this.showSnackbar("Erreur lors de l'ajout de l'employé.", 'Fermer', 'error');
    }
  }
  

  async deleteEmploye(id?: string, uid?: string) {
    if (!id || !uid) return;

    if (confirm("Voulez-vous vraiment supprimer cet employé ?")) {
      try {
        await deleteDoc(doc(this.firestore, `entreprises/${this.entrepriseId}/employes`, id));
        this.showSnackbar("Employé supprimé avec succès.", 'Fermer', 'success');
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        this.showSnackbar("Une erreur est survenue lors de la suppression.", 'Fermer', 'error');
      }
    }
  }
}