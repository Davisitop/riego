import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private baseUrl = 'https://esp32-c9568-default-rtdb.firebaseio.com';
  private auth = 'rUe38RFDOcDmOFxNKK96aBRrwOa2gIYD5jUFV6wq';

  async getSensorData(): Promise<any> {
    try {
      const url = `${this.baseUrl}/.json?auth=${this.auth}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al leer datos de Firebase');
      return await response.json();
    } catch (err) {
      console.error('FirebaseService error:', err);
      return null;
    }
  }
}
