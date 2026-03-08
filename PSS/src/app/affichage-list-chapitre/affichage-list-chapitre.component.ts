
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';
import { SubService, CreateSub } from '../services/sub.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

interface chapterDisplay {
  id: string;
  number: string;
}

@Component({
    selector: 'app-affichage-list-chapitre',
    templateUrl: './affichage-list-chapitre.component.html',
    styleUrls: ['./affichage-list-chapitre.component.scss'],
    standalone: true,
    imports: []
})
export class AffichageListChapitreComponent implements OnInit, OnDestroy {
  chaptersEN: chapterDisplay[] = [];
  chaptersFR: chapterDisplay[] = [];
  id: string = "";
  mangaName: string = '';
  mangaDescription: string = '';
  mangaCover: string = '';
  isSubscribed: boolean = false;
  currentSubscriptionId: number | null = null;
  lastChapterRead: string = '';
  private userSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private route: ActivatedRoute,
    private router: Router,
    private subService: SubService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur pour mettre à jour l'état d'abonnement
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && this.id) {
        this.checkSubscription();
      } else if (!user) {
        this.isSubscribed = false;
        this.currentSubscriptionId = null;
      }
    });

    // S'abonner aux changements de paramètres de route
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      this.resetData();
      this.loadMangaInfo();
      this.loadChapterListEN();
      this.loadChapterListFR();
      // Vérifier l'abonnement après avoir défini l'ID
      if (this.authService.isLoggedIn) {
        this.checkSubscription();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  resetData(): void {
    this.chaptersEN = [];
    this.chaptersFR = [];
    this.mangaName = '';
    this.mangaDescription = '';
    this.mangaCover = '';
    this.isSubscribed = false;
    this.currentSubscriptionId = null;
    this.lastChapterRead = '';
  }

  checkSubscription(): void {
    if (this.authService.isLoggedIn && this.authService.currentUser) {
      this.subService.getByUserAndManga(this.authService.currentUser.id, this.id).subscribe({
        next: (sub) => {
          this.isSubscribed = true;
          this.currentSubscriptionId = sub.id;
          this.lastChapterRead = sub.lastChapterRead || '';
        },
        error: () => {
          this.isSubscribed = false;
          this.currentSubscriptionId = null;
          this.lastChapterRead = '';
        }
      });
    }
  }

  loadMangaInfo(): void {
    this.latestMangaAPIENService.getMangaById(this.id).subscribe(
      (data: any) => {
        const manga = data?.data?.attributes;
        const titleObj = manga?.title ?? {};
        this.mangaName = titleObj.en || titleObj.fr || titleObj.jp || titleObj.ko || titleObj.zh || Object.values(titleObj)[0] || 'Sans titre';
        this.mangaDescription = manga?.description?.en ?? manga?.description?.fr ?? '';
        const coverRel = data?.data?.relationships?.find((r: any) => r.type === 'cover_art');
        const coverId = coverRel?.id;
        const fileName = coverRel?.attributes?.fileName;
        if (coverId && fileName) {
          this.mangaCover = `${environment.mangadexUploadsUrl}/covers/${this.id}/${fileName}.256.jpg`;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  loadChapterListEN(): void {
    this.latestMangaAPIENService.getChapterEN(this.id).subscribe(
      (data: any) => {
        if (!data || !data.volumes) return;
        for (const volume in data.volumes) {
          if (!data.volumes[volume].chapters) continue;
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersEN.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  loadChapterListFR(): void {
    this.latestMangaAPIENService.getChapterFR(this.id).subscribe(
      (data: any) => {
        if (!data || !data.volumes) return;
        for (const volume in data.volumes) {
          if (!data.volumes[volume].chapters) continue;
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersFR.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onChapterClickEN(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "en", this.id, item.number, item.id]);
  }

  onChapterClickFR(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "fr", this.id, item.number, item.id]);
  }

  onSubscribe(): void {
    if (!this.authService.isLoggedIn) {
      return;
    }

    const subscription: CreateSub = {
      userId: this.authService.currentUser!.id,
      idManga: this.id,
      nameManga: this.mangaName || 'Manga',
      lastChapterRead: '0'
    };

    this.subService.create(subscription).subscribe({
      next: (result) => {
        console.log('Abonnement créé:', result);
        this.isSubscribed = true;
        this.currentSubscriptionId = result.id;
      },
      error: (error) => {
        console.error('Erreur lors de l\'abonnement:', error);
        alert('Erreur lors de l\'abonnement');
      }
    });
  }

  onUnsubscribe(): void {
    if (!this.currentSubscriptionId) {
      return;
    }

    this.subService.delete(this.currentSubscriptionId).subscribe({
      next: () => {
        console.log('Abonnement supprimé');
        this.isSubscribed = false;
        this.currentSubscriptionId = null;
        this.lastChapterRead = '';
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'abonnement');
      }
    });
  }

  resumeReading(): void {
    if (!this.lastChapterRead || this.lastChapterRead === '0') return;

    // Chercher d'abord dans les chapitres EN, sinon FR
    let chapter = this.chaptersEN.find(ch => ch.number === this.lastChapterRead);
    if (chapter) {
      this.router.navigate(['chapterJPG', 'en', this.id, chapter.number, chapter.id]);
      return;
    }

    chapter = this.chaptersFR.find(ch => ch.number === this.lastChapterRead);
    if (chapter) {
      this.router.navigate(['chapterJPG', 'fr', this.id, chapter.number, chapter.id]);
    }
  }

  get canResumeReading(): boolean {
    return this.isSubscribed && !!this.lastChapterRead && this.lastChapterRead !== '0';
  }
}