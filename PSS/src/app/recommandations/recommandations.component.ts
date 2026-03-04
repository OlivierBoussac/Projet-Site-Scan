import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MangaAIService, MangaRecommendationResponse } from '../services/manga-ai.service';

@Component({
  selector: 'app-recommandations',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recommandations.component.html',
  styleUrls: ['./recommandations.component.scss']
})
export class RecommandationsComponent {
  description: string = '';
  recommendations: string[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private mangaAIService: MangaAIService,
    private router: Router
  ) {}

  onSearch(): void {
    if (!this.description.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.recommendations = [];

    this.mangaAIService.getRecommendations(this.description).subscribe({
      next: (response: MangaRecommendationResponse) => {
        this.recommendations = response.recommendations;
        if (response.recommendations.length === 0) {
          this.errorMessage = response.message || 'Aucune recommandation trouvée';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des recommandations:', error);
        this.errorMessage = 'Erreur lors de la récupération des recommandations. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  onMangaClick(mangaName: string): void {
    this.router.navigate(['listMangaSearch', mangaName]);
  }
}
