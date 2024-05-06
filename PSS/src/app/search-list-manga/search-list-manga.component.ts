import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface mangaDisplay {
  name: string;
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
    this.route.paramMap.subscribe(params => {
      this.mangaListDisplay = [];
      this.mangaName = params.get('mangaName') || '';
      this.searchManga();
    });
  }

  searchManga() {
    this.latestMangaAPIENService.getSearchManga(this.mangaName).subscribe(
      (data: any) => {
        data.data.forEach((element: any) => {
          if (element.attributes.title.en != null)
            this.mangaListDisplay.push({name: element.attributes.title.en,id: element.id});
          else 
            this.mangaListDisplay.push({name: element.attributes.title.ja,id: element.id});
        });
      }
    );
  }

  onMangaClick(id: string): void {
    this.router.navigate(['listChapter', id]);
  }
}
