import { Component, OnInit } from '@angular/core';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface mangaDisplay {
  name: string;
  description : string;
}
@Component({
  selector: 'app-test-affichage',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './test-affichage.component.html',
  styleUrl: './test-affichage.component.scss'
})
export class TestAffichageComponent implements OnInit {
  mangaList: any[] | undefined;
  mangaListDisplay: mangaDisplay[] = [];

  constructor(private latestMangaAPIENService: LatestMangaAPIENService) { }

  ngOnInit(): void {
    this.loadMangaList();
  }

  loadMangaList(): void {
    this.latestMangaAPIENService.getLastMangaUpdated().subscribe(
      (data: any) => {
        this.mangaList = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.loadMangaData();
  }

  loadMangaData():void {
    let i = 0;
    this.mangaList?.forEach(manga => {
      const mangaData: mangaDisplay = {
        name: manga.attributes.title.en, 
        description: manga.attributes.description.en
      };
      this.mangaListDisplay[i] = mangaData;
      i++;
    });
  }
}
