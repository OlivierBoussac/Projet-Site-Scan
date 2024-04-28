import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface chapterDisplay {
  id: string;
  number: string;
}

@Component({
  selector: 'app-affichage-list-chapitre',
  templateUrl: './affichage-list-chapitre.component.html',
  styleUrl: './affichage-list-chapitre.component.scss',
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})
export class AffichageListChapitreComponent implements OnInit {
  chapters: chapterDisplay[] = [];
  id: string = "";

  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id += this.route.snapshot.paramMap.get('id');
    this.loadChapterList();
  }

  loadChapterList(): void {
    this.latestMangaAPIENService.getChapter(this.id).subscribe(
      (data: any) => {
        for (const volume in data.volumes) {
          for (const chapter in data.volumes[volume].chapters) {
            this.chapters.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChapterClick(id: string) {
    this.router.navigate(['chapterJPG', id]);
  }
}