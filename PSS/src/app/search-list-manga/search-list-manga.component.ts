import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MangaAPIService } from '../manga-api.service';

interface mangaDisplay {
  name: string;
  id: string;
  cover: string;
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
    private mangaAPIService: MangaAPIService,
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
    this.mangaAPIService.getSearchManga(this.mangaName).subscribe(
      (data: any) => {
        data.data.forEach((element: any) => {
          this.mangaAPIService.getCoverManga(element.id).subscribe(
            (cover:any) => {
              if (cover.data[0].attributes.fileName == null) 
                cover.data[0].attributes.fileName = "";
              if (element.attributes.title.en != null)
                this.mangaListDisplay.push({name: element.attributes.title.en,id: element.id, cover: cover.data[0].attributes.fileName});
              else 
                this.mangaListDisplay.push({name: element.attributes.title.ja,id: element.id, cover: cover.data[0].attributes.fileName});
            }
          );
        });
      }
    );
  }

  onMangaClick(id: string, name:string): void {
    this.router.navigate(['listChapter', id, name]);
  }
}
