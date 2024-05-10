import { Component, OnInit } from '@angular/core';
import { MangaAPIService } from '../manga-api.service';
import { Router, RouterOutlet } from '@angular/router'; // Assurez-vous que vous importez Router depuis @angular/router
import { CommonModule } from '@angular/common';

interface mangaDisplay {
  name: string;
  id: string;
  cover: string;
}

@Component({
  selector: 'app-test-affichage',
  templateUrl: './affichage-list-manga.component.html',
  styleUrls: ['./affichage-list-manga.component.scss'],
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})
export class AffichageListMangaComponent implements OnInit {
  mangaListDisplay: mangaDisplay[] = [];

  constructor(
    private mangaAPIService: MangaAPIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMangaList();
  }

  loadMangaList(): void {
    this.mangaAPIService.getLastMangaUpdated().subscribe(
      (data: any) => {
          data.data.forEach((element : any) => {
            this.mangaAPIService.getCoverManga(element.id).subscribe(
              (cover: any) => {   
                this.mangaListDisplay.push({name: element.attributes.title.en, id: element.id, cover: cover.data[0].attributes.fileName})
              }
            );
          });      
        },
      (error) => {
        console.log(error);
      }
    );
  }

  onMangaClick(id: string, name: string): void {
    this.router.navigate(['listChapter', id, name]);
  }
}
