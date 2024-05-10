import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener  } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MangaAPIService } from '../manga-api.service';

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
    private mangaAPIService: MangaAPIService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  numberChap: string = "";
  idChap: string = "";
  idManga: string = "";
  langue: string = "";
  mangaName: string = "";
  indexChap : string = "";
  chapMax : string = "";
  chapters: chapterDisplay[] = [];
  listURL: string[] = [];
  showScrollTopButton: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.numberChap = params.get('numberChap') || '';
      this.mangaName = params.get('mangaName') || '';
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
  }

  loadChapterJPG(): void {
    this.mangaAPIService.getChapterJPG(this.idChap).subscribe(
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
        this.mangaAPIService.getChapterEN(this.idManga).subscribe(
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
        this.mangaAPIService.getChapterFR(this.idManga).subscribe(
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

  chapSuivant() {
    this.router.navigate([ 'chapterJPG', this.langue, this.idManga, (parseInt(this.numberChap)+1).toString(), (this.chapters[parseInt(this.numberChap)+1]).id]);
  }

  chapPrecedent() {
    this.router.navigate(['chapterJPG', this.langue, this.idManga, (parseInt(this.numberChap)-1).toString(), (this.chapters[parseInt(this.numberChap)-1]).id]);  
  }

  returnChapMenu(id: string, name: string) {
    this.router.navigate(['listChapter', id , name]);  
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTopButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 100;
  }
}

