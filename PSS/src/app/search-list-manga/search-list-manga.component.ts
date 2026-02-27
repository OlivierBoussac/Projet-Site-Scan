import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface mangaDisplay {
  name: string;
  id: string;
  coverUrl?: string;
}

@Component({
    selector: 'app-search-list-manga',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './search-list-manga.component.html',
    styleUrls: ['./search-list-manga.component.scss']
})
export class SearchListMangaComponent {
  mangaListDisplay: mangaDisplay[] = [];
  mangaName: string = "";  

  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mangaListDisplay = [];
      this.mangaName = params.get('mangaName') || '';
      this.searchManga();
    });
  }

  searchManga() {
    if (!this.mangaName) {
      this.mangaListDisplay = [];
      return;
    }

    this.latestMangaAPIENService.getSearchManga(this.mangaName).subscribe(
      (items: any[]) => {
        this.mangaListDisplay = items.map((element: any) => {
          const titleObj = element?.attributes?.title ?? {};
          const name = titleObj.en || titleObj.fr || titleObj.jp || titleObj.ko || titleObj.zh || Object.values(titleObj)[0] || 'Untitled';
          return {
            name,
            id: element?.id ?? '',
            coverUrl: element?.coverUrl || 'assets/placeholder-manga.png'
          };
        });
      },
      (err) => {
        console.error('searchManga error', err);
        this.mangaListDisplay = [];
      }
    );
  }

  onMangaClick(id: string): void {
    this.router.navigate(['listChapter', id]);
  }
}
