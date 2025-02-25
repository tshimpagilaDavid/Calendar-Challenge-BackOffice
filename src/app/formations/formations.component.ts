import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


interface Formation {
  id: string;
  nom: string;
  duree: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css'],
  standalone: false
})
export class FormationListComponent implements OnInit {
  formations: Formation[] = [];
  isLoading: boolean = true; // Pour gérer l'état du loader

  constructor(private firestore: Firestore, private router: Router, private location: Location) {}

  async ngOnInit(): Promise<void> {
    await this.loadFormations();
    this.isLoading = false; // Désactiver le loader une fois les données chargées
  }

  async loadFormations(): Promise<void> {
    const formationsCollection = collection(this.firestore, 'formations');
    const formationsSnapshot = await getDocs(formationsCollection);
    this.formations = formationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Formation[];
  }

  selectFormation(formation: Formation): void {
    this.router.navigate(['/formation', formation.id]);
  }

  goBack(): void {
    this.location.back();
  }
}