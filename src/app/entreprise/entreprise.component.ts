import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, DocumentData } from '@angular/fire/firestore';
import { Observable, combineLatest, map, switchMap, of } from 'rxjs';
import { Location } from '@angular/common';

interface Entreprise {
  id: string;
  nom: string;
  secteur: string;
  employesCount?: number;
  logo?: string;
}

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss'],
  standalone: false
})
export class EntrepriseComponent {
  entreprises$: Observable<Entreprise[]>;
  isLoading: boolean = true;

  constructor(private firestore: Firestore, private router: Router, private location: Location) {
    const entreprisesRef = collection(this.firestore, 'entreprises');

    this.entreprises$ = collectionData(entreprisesRef, { idField: 'id' }).pipe(
      map(docs => docs as Entreprise[]), // Cast explicite des données en Entreprise[]
      switchMap((entreprises: Entreprise[]) => {
        if (entreprises.length === 0) {
          return of([]); // Évite les erreurs si aucune entreprise n'est trouvée
        }

        // Crée un observable pour chaque entreprise récupérant le nombre d'employés
        const entreprisesWithCounts$ = entreprises.map(entreprise => 
          this.getEmployesCount(entreprise.id).pipe(
            map(count => ({ ...entreprise, employesCount: count }))
          )
        );

        return combineLatest(entreprisesWithCounts$);
      })
    );

    this.entreprises$.subscribe(() => {
      this.isLoading = false;
    });
  }

  getEmployesCount(entrepriseId: string): Observable<number> {
    if (!entrepriseId) return of(0);
    const employesRef = collection(this.firestore, `entreprises/${entrepriseId}/employes`);
    return collectionData(employesRef).pipe(map(employes => employes.length));
  }

  goBack() {
    this.location.back();
  }

  selectEntreprise(entreprise: Entreprise) {
    this.router.navigate(['/entreprise', entreprise.id]);
  }
}
