import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubService, Sub } from '../services/sub.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface SubscriptionDisplay extends Sub {
  coverUrl?: string;
}

@Component({
  selector: 'app-mes-abonnements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-abonnements.component.html',
  styleUrls: ['./mes-abonnements.component.scss']
})
export class MesAbonnementsComponent implements OnInit, OnDestroy {
  subscriptions: SubscriptionDisplay[] = [];
  isLoading: boolean = false;
  private userSubscription?: Subscription;

  constructor(
    private subService: SubService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();

    // S'abonner aux changements d'utilisateur
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadSubscriptions();
      } else {
        this.subscriptions = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadSubscriptions(): void {
    if (!this.authService.isLoggedIn || !this.authService.currentUser) {
      this.subscriptions = [];
      return;
    }

    this.isLoading = true;
    this.subService.getByUserId(this.authService.currentUser.id).subscribe({
      next: (subs) => {
        this.subscriptions = subs.map(sub => ({
          ...sub,
          coverUrl: `${environment.mangadexUploadsUrl}/covers/${sub.idManga}/.256.jpg`
        }));
        // Charger les covers pour chaque manga
        this.loadCovers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des abonnements:', error);
        this.subscriptions = [];
        this.isLoading = false;
      }
    });
  }

  loadCovers(): void {
    // Pour chaque abonnement, récupérer la cover du manga
    this.subscriptions.forEach((sub, index) => {
      fetch(`${environment.mangadexUrl}/manga/${sub.idManga}?includes[]=cover_art`)
        .then(res => res.json())
        .then(data => {
          const coverRel = data?.data?.relationships?.find((r: any) => r.type === 'cover_art');
          const fileName = coverRel?.attributes?.fileName;
          if (fileName) {
            this.subscriptions[index].coverUrl = `${environment.mangadexUploadsUrl}/covers/${sub.idManga}/${fileName}.256.jpg`;
          }
        })
        .catch(err => console.error('Erreur cover:', err));
    });
  }

  onMangaClick(idManga: string): void {
    this.router.navigate(['listChapter', idManga]);
  }
}
