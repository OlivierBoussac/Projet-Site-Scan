import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LatestMangaAPIENService } from '../latest-manga-api-en.service';

interface chapterDisplay {
  id: string;
  number: string;
}

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

  numberChap: string = "";
  idChap: string = "";
  idManga: string = "";
  langue: string = "";
  indexPage : number = 0;
  indexChap : string = "";
  chapMax : string = "";
  chapters: chapterDisplay[] = [];
  listURL: string[] = [];
  allDisplay: boolean = false

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.numberChap = params.get('numberChap') || '';
      this.idManga = params.get('idManga') || '';
      this.idChap = params.get('idChap') || '';
      this.langue = params.get('langue') || '';
      this.loadChapterList();
      this.loadChapterJPG();
      this.initData();
    });
  }

  initData() {
    this.listURL = [];
    this.indexPage = 0;
  }

  loadChapterJPG(): void {
    this.latestMangaAPIENService.getChapterJPG(this.idChap).subscribe(
      (data: any) => {
        for (let index = 0; index < data.chapter.data.length; index++) {
          this.listURL.push(data.baseUrl+"/data/"+data.chapter.hash+"/"+data.chapter.data[index])
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadChapterList(): void {
    switch (this.langue) {
      case "en":
        this.latestMangaAPIENService.getChapterEN(this.idManga).subscribe(
          (data: any) => {
            for (const volume in data.volumes) {
              for (const chapter in data.volumes[volume].chapters) {
                this.chapters.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
                if (this.numberChap == data.volumes[volume].chapters[chapter].chapter)
                  this.idChap += data.volumes[volume].chapters[chapter].id;
              }
            }
            this.chapMax = this.chapters[this.chapters.length-1].number;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case "fr":
        this.latestMangaAPIENService.getChapterFR(this.idManga).subscribe(
          (data: any) => {
            for (const volume in data.volumes) {
              for (const chapter in data.volumes[volume].chapters) {
                this.chapters.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
                if (this.numberChap == data.volumes[volume].chapters[chapter].chapter)
                  this.idChap += data.volumes[volume].chapters[chapter].id;
              }
            }
            this.chapMax = this.chapters[this.chapters.length-1].number;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
    }
  }

  precedentJPG() {
    this.indexPage--;
  }

  suivantJPG() {
    this.indexPage++;
  }

  chapSuivant() {
    this.router.navigate([ 'chapterJPG', this.langue, this.idManga, (parseInt(this.numberChap)+1).toString(), (this.chapters[parseInt(this.numberChap)+1]).id]);
  }

  chapPrecedent() {
    this.router.navigate(['chapterJPG', this.langue, this.idManga, (parseInt(this.numberChap)-1).toString(), (this.chapters[parseInt(this.numberChap)-1]).id]);  
  }

  changeDisplay() {
    this.allDisplay = !this.allDisplay;
  }
}
