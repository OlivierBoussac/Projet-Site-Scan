import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Sub {
  id: number;
  userId: number;
  idManga: string;
  nameManga: string;
  lastChapterRead: string;
}

export interface CreateSub {
  userId: number;
  idManga: string;
  nameManga: string;
  lastChapterRead: string;
}

export interface UpdateSub {
  lastChapterRead?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubService {
  private apiUrl = `${environment.apiUrl}/subs`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les subscriptions
  getAll(): Observable<Sub[]> {
    return this.http.get<Sub[]>(this.apiUrl);
  }

  // Récupérer les subscriptions d'un utilisateur
  getByUserId(userId: number): Observable<Sub[]> {
    return this.http.get<Sub[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Récupérer une subscription par ID
  getById(id: number): Observable<Sub> {
    return this.http.get<Sub>(`${this.apiUrl}/${id}`);
  }

  // Vérifier si un utilisateur est abonné à un manga
  getByUserAndManga(userId: number, idManga: string): Observable<Sub> {
    return this.http.get<Sub>(`${this.apiUrl}/user/${userId}/manga/${encodeURIComponent(idManga)}`);
  }

  // Créer une subscription
  create(sub: CreateSub): Observable<Sub> {
    return this.http.post<Sub>(this.apiUrl, sub);
  }

  // Modifier une subscription
  update(id: number, sub: UpdateSub): Observable<Sub> {
    return this.http.put<Sub>(`${this.apiUrl}/${id}`, sub);
  }

  // Supprimer une subscription
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
