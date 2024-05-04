import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface mangaDisplay {
  name: string;
  description: string;
  id: string;
}

@Component({
  selector: 'app-search-list-manga',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './search-list-manga.component.html',
  styleUrl: './search-list-manga.component.scss'
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
    this.mangaListDisplay = [];
    this.mangaName = this.route.snapshot.paramMap.get('mangaName') || '';
    this.searchManga();
  }

  searchManga() {
    this.latestMangaAPIENService.getSearchManga(this.mangaName).subscribe(
      (data: any) => {
        this.mangaListDisplay = data.data.map((manga: any) => ({
          name: manga.attributes.title.en,
          id: manga.id
        }));
      }
    );
  }

  onMangaClick(id: string): void {
    this.router.navigate(['listChapter', id]);
  }
}
