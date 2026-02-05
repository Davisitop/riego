import { Injectable, inject } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private database: Database = inject(Database);

  getSensorData(): Observable<any> {
    const dataRef = ref(this.database, '/');
    return objectVal(dataRef);
  }
}
