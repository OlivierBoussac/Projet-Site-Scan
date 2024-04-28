import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface chapterDisplay {
  id: number;
  name: string;
}

@Component({
  selector: 'app-affichage-list-chapitre',
  templateUrl: './affichage-list-chapitre.component.html',
  styleUrl: './affichage-list-chapitre.component.scss'
})
export class AffichageListChapitreComponent implements OnInit{

  chapter: chapterDisplay[] = [];

  constructor(private latestMangaAPIENService: LatestMangaAPIENService) { }

  ngOnInit(): void {
    
  }

}
