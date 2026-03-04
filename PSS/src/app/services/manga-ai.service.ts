import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MangaRecommendationRequest {
  description: string;
}

export interface MangaRecommendationResponse {
  recommendations: string[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MangaAIService {
  private apiUrl = `${environment.apiUrl}/mangaai`;

  constructor(private http: HttpClient) { }

  getRecommendations(description: string): Observable<MangaRecommendationResponse> {
    return this.http.post<MangaRecommendationResponse>(`${this.apiUrl}/recommendations`, { description });
  }
}
