import { Component, OnInit } from '@angular/core';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';
import { Router } from '@angular/router'; // Assurez-vous que vous importez Router depuis @angular/router
import { CommonModule } from '@angular/common';

interface mangaDisplay {
  name: string;
  description: string;
  id: string;
}

@Component({
  selector: 'app-test-affichage',
  templateUrl: './test-affichage.component.html',
  styleUrls: ['./test-affichage.component.scss']
})
export class TestAffichageComponent implements OnInit {
  mangaListDisplay: mangaDisplay[] = [];

  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private router: Router // Assurez-vous que vous importez Router correctement
  ) { }

  ngOnInit(): void {
    this.loadMangaList();
  }

  loadMangaList(): void {
    this.latestMangaAPIENService.getLastMangaUpdated().subscribe(
      (data: any) => {
        this.mangaListDisplay = data.data.map((manga: any) => ({
          name: manga.attributes.title.en,
          description: manga.attributes.description.en,
          id: manga.id
        }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onMangaClick(id: string): void {
    this.router.navigate(['/listChapter']);
  }
}
