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
    styleUrls: ['./affichage-list-chapitre.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AffichageListChapitreComponent implements OnInit {
  chaptersEN: chapterDisplay[] = [];
  chaptersFR: chapterDisplay[] = [];
  id: string = "";
  mangaName: string = '';
  mangaDescription: string = '';
  mangaCover: string = '';

  constructor(
    private latestMangaAPIENService: LatestMangaAPIENService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id += this.route.snapshot.paramMap.get('id');
    this.loadMangaInfo();
    this.loadChapterListEN();
    this.loadChapterListFR();
  }

  loadMangaInfo(): void {
    this.latestMangaAPIENService.getMangaById(this.id).subscribe(
      (data: any) => {
        const manga = data?.data?.attributes;
        const titleObj = manga?.title ?? {};
        this.mangaName = titleObj.en || titleObj.fr || titleObj.jp || titleObj.ko || titleObj.zh || Object.values(titleObj)[0] || 'Sans titre';
        this.mangaDescription = manga?.description?.en ?? manga?.description?.fr ?? '';
        const coverRel = data?.data?.relationships?.find((r: any) => r.type === 'cover_art');
        const coverId = coverRel?.id;
        const fileName = coverRel?.attributes?.fileName;
        if (coverId && fileName) {
          this.mangaCover = `https://uploads.mangadex.org/covers/${this.id}/${fileName}.256.jpg`;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  loadChapterListEN(): void {
    this.latestMangaAPIENService.getChapterEN(this.id).subscribe(
      (data: any) => {
        if (!data || !data.volumes) return;
        for (const volume in data.volumes) {
          if (!data.volumes[volume].chapters) continue;
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersEN.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  loadChapterListFR(): void {
    this.latestMangaAPIENService.getChapterFR(this.id).subscribe(
      (data: any) => {
        if (!data || !data.volumes) return;
        for (const volume in data.volumes) {
          if (!data.volumes[volume].chapters) continue;
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersFR.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onChapterClickEN(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "en", this.id, item.number, item.id]);
  }

  onChapterClickFR(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "fr", this.id, item.number, item.id]);
  }
}