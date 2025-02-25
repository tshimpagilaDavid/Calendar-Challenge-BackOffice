import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

interface Formation {
  id: string;
  nom: string;
  duree: number; // Utilisez "duree" au lieu de "durée"
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-formation-details',
  templateUrl: './formation-details.component.html',
  styleUrls: ['./formation-details.component.css'],
  standalone: false
})
export class FormationDetailComponent implements OnInit {
  formation: Formation | null = null;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadFormation(id);
    }
  }

  async loadFormation(id: string): Promise<void> {
    const formationDoc = doc(this.firestore, `formations/${id}`);
    const formationSnapshot = await getDoc(formationDoc);

    if (formationSnapshot.exists()) {
      this.formation = {
        id: formationSnapshot.id,
        ...formationSnapshot.data(),
      } as Formation;
    } else {
      alert('Formation non trouvée.');
      this.router.navigate(['/formations']);
    }
  }

  async updateFormation(): Promise<void> {
    if (this.formation) {
      const formationDoc = doc(this.firestore, `formations/${this.formation.id}`);
      await updateDoc(formationDoc, {
        nom: this.formation.nom,
        duree: this.formation.duree, // Utilisez "duree" au lieu de "durée"
        description: this.formation.description,
        imageUrl: this.formation.imageUrl,
      });
      alert('Formation mise à jour avec succès !');
    }
  }
}