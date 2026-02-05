import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyA2-REEMPLAZA-ESTE-VALOR",
  authDomain: "esp32-c9568.firebaseapp.com",
  databaseURL: "https://esp32-c9568-default-rtdb.firebaseio.com",
  projectId: "esp32-c9568",
  storageBucket: "esp32-c9568.appspot.com",
  messagingSenderId: "REEMPLAZA-ESTE-VALOR",
  appId: "REEMPLAZA-ESTE-VALOR"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};