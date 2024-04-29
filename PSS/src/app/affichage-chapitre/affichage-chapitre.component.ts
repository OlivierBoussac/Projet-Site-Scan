import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

@Component({
  selector: 'app-affichage-chapitre',
  templateUrl: './affichage-chapitre.component.html',
  styleUrl: './affichage-chapitre.component.scss',
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})

export class AffichageChapitreComponent implements OnInit {
  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  id: string = "";
  baseURL: string = "";
  hash : string = "";
  data : string[] = [];
  index : number = 5;

  ngOnInit(): void {
    this.id += this.route.snapshot.paramMap.get('id');
    this.loadChapterJPG()
  }

  loadChapterJPG(): void {
    this.latestMangaAPIENService.getChapterJPG(this.id).subscribe(
      (data: any) => {
        this.baseURL = data.baseUrl;
        this.hash = data.chapter.hash
        this.data = data.chapter.data
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
