import { Component, OnInit } from '@angular/core';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';

interface mangaDisplay {
  name: string;
  description: string;
  id: string;
  coverUrl?: string;
  lastChapter?: string;
}

@Component({
  selector: 'app-test-affichage',
  templateUrl: './affichage-list-manga.component.html',
  styleUrls: ['./affichage-list-manga.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AffichageListMangaComponent implements OnInit {
  mangaListDisplayLastUpdated: mangaDisplay[] = [];
  mangaListDisplayPopular: mangaDisplay[] = [];

  constructor(private latestMangaAPIENService: LatestMangaAPIENService, private router: Router) { }

  ngOnInit(): void {
    this.loadMangaList();
  }

  loadMangaList(): void {
    this.latestMangaAPIENService.getLastMangaUpdated().subscribe(
      (data: any) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        this.mangaListDisplayLastUpdated = items.map((manga: any) => {
          const titleObj = manga?.attributes?.title ?? {};
          const name = titleObj.en || titleObj.fr || titleObj.jp || titleObj.ko || titleObj.zh || Object.values(titleObj)[0] || 'Untitled';
          return {
            name,
            description: manga?.attributes?.description?.en ?? '',
            id: manga?.id ?? '',
            coverUrl: manga?.coverUrl ?? '',
            lastChapter: (manga?.attributes?.lastChapter ?? manga?.attributes?.latestChapter ?? manga?.attributes?.chapter ?? '').toString().trim() || undefined
          };
        });
      },
      (error) => {
        console.error('loadMangaList error', error);
        this.mangaListDisplayLastUpdated = [];
      }
    );

    this.latestMangaAPIENService.getPopularManga().subscribe(
      (data: any) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        this.mangaListDisplayPopular = items.map((manga: any) => {
          const titleObj = manga?.attributes?.title ?? {};
          const name = titleObj.en || titleObj.fr || titleObj.jp || titleObj.ko || titleObj.zh || Object.values(titleObj)[0] || 'Untitled';
          return {
            name,
            description: manga?.attributes?.description?.en ?? '',
            id: manga?.id ?? '',
            coverUrl: manga?.coverUrl ?? '',
            lastChapter: (manga?.attributes?.lastChapter ?? manga?.attributes?.latestChapter ?? manga?.attributes?.chapter ?? '').toString().trim() || undefined
          };
        });
      },
      (error) => {
        console.error('loadMangaList error', error);
        this.mangaListDisplayPopular = [];
      }
    );
  }

  onMangaClick(id: string): void {
    this.router.navigate(['listChapter', id]);
  }
}
