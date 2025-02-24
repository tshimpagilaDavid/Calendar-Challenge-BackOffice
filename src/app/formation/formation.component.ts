import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importez le SDK Google Generative AI
import { environment } from '../../environments/environment'; // Importez l'environnement

interface Day {
  citation: string;
  astuce: string;
  challengesNumber: number;
  challenges: string[];
}

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css'],
  standalone: false,
})
export class FormationComponent {
  private firestore: Firestore = inject(Firestore); // Injectez Firestore
  private genAI: GoogleGenerativeAI; // Instance de Google Generative AI

  formation = {
    imageUrl: '', // URL de l'image de la formation (base64)
    title: '', // Titre de la formation
    imageFile: null as File | null, // Fichier image sélectionné
    theme: '', // Thème de la formation
  };

  daysNumber: number = 0; // Nombre de jours sélectionné
  challengesPerDay: number = 0; // Nombre de défis par jour
  days: Day[] = []; // Liste des jours générés

  constructor(private location: Location) {
    // Initialisez Google Generative AI avec votre clé API
    this.genAI = new GoogleGenerativeAI(environment.googleGenerativeAIKey);
  }

  // Gère le clic sur la zone d'image
  onImageClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => this.handleImageSelection(event);
    input.click();
  }

  // Gère la sélection de l'image
  handleImageSelection(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formation.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formation.imageUrl = e.target.result; // Encode l'image en base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Génère les jours en fonction du nombre sélectionné
  generateDays(): void {
    this.days = [];
    for (let i = 0; i < this.daysNumber; i++) {
      this.days.push({
        citation: '',
        astuce: '',
        challengesNumber: this.challengesPerDay,
        challenges: [],
      });
    }
  }

  // Appelle l'API Google Generative AI pour générer du contenu
  async generateContentWithAI(): Promise<void> {
    if (!this.formation.theme) {
      alert('Veuillez entrer un thème pour la formation.');
      return;
    }

    if (this.daysNumber === 0 || this.challengesPerDay === 0) {
      alert('Veuillez spécifier le nombre de jours et le nombre de défis par jour.');
      return;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' }); // Utilisez le modèle Gemini Pro

      // Prompt prédéfini
      const prompt = `
        Vous êtes un expert en formation. Voici le thème de la formation :
        "${this.formation.theme}".

        Pour chaque jour de la formation, générez :
        1. Une citation inspirante en lien avec le thème.
        2. Une astuce pratique pour appliquer le thème.
        3. ${this.challengesPerDay} défis à relever pour approfondir le thème.

        Nombre de jours : ${this.daysNumber}.
        Nombre de défis par jour : ${this.challengesPerDay}.

        Pour chaque jour, fournissez les informations dans l'ordre suivant :
        - Citation : [citation]
        - Astuce : [astuce]
        - Défi 1 : [défi 1]
        - Défi 2 : [défi 2]
        - ...
        - Défi ${this.challengesPerDay} : [défi ${this.challengesPerDay}]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text(); // Récupère le texte généré

      this.parseGeneratedContent(generatedText); // Analyse et remplit les champs
    } catch (error) {
      console.error('Erreur lors de la génération du contenu :', error);
      alert('Une erreur est survenue lors de la génération du contenu.');
    }
  }

  // Analyse le texte généré et remplit les champs
  parseGeneratedContent(content: string): void {
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    let currentDayIndex = 0;
    let currentChallengeIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('Citation :')) {
        this.days[currentDayIndex].citation = line.replace('Citation :', '').trim();
      } else if (line.includes('Astuce :')) {
        this.days[currentDayIndex].astuce = line.replace('Astuce :', '').trim();
      } else if (line.includes('Défi')) {
        const challenge = line.replace(/Défi \d+ :/, '').trim(); // Supprime "Défi X :" pour ne garder que le texte
        this.days[currentDayIndex].challenges.push(challenge);
        currentChallengeIndex++;

        // Passe au jour suivant après avoir traité tous les défis du jour actuel
        if (currentChallengeIndex === this.challengesPerDay) {
          currentDayIndex++;
          currentChallengeIndex = 0;
        }
      }
    }
  }

  // Ajoute la formation dans Firestore
  async addFormation(): Promise<void> {
    if (!this.formation.title) {
      alert('Veuillez entrer un titre pour la formation.');
      return;
    }

    // Structure des données de la formation
    const formationData = {
      nom: this.formation.title,
      durée: this.daysNumber * 60, // Exemple de calcul de durée
      theme: this.formation.theme, // Thème de la formation
      imageUrl: this.formation.imageUrl, // Image encodée en base64
      défis: this.days.map((day) => ({
        citation: day.citation,
        astuce: day.astuce,
        défis: day.challenges,
      })),
    };

    try {
      const formationDocRef = doc(this.firestore, `formations/${this.formation.title}`);
      await setDoc(formationDocRef, formationData);
      alert('Formation ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation :', error);
      alert('Une erreur est survenue lors de l\'ajout de la formation.');
    }
  }

  // Revenir à la page précédente
  goBack(): void {
    this.location.back();
  }
}