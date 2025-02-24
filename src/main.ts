import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Importer Firebase et la méthode d'initialisation
import { initializeApp } from 'firebase/app';

// Initialiser Firebase avec la configuration de votre projet Firebase
initializeApp(environment.firebaseConfig);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
