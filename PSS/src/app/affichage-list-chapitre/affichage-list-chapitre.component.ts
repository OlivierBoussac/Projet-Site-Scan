import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MangaAPIService } from '../manga-api.service';
import { FollowsService } from '../follows.service';

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
  chaptersEN: chapterDisplay[] = [];
  chaptersFR: chapterDisplay[] = [];
  id: string = "";
  mangaName: string = "";
  isfollow: boolean = false;

  constructor(
    private mangaAPIService: MangaAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private followsService: FollowsService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.mangaName = this.route.snapshot.paramMap.get('mangaName') || '';
    this.loadChapterListEN();
    this.loadChapterListFR();
    this.getAlreadyFollow();
  }

  loadChapterListEN(): void {
    this.mangaAPIService.getChapterEN(this.id).subscribe(
      (data: any) => {
        for (const volume in data.volumes) {
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersEN.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadChapterListFR(): void {
    this.mangaAPIService.getChapterFR(this.id).subscribe(
      (data: any) => {
        for (const volume in data.volumes) {
          for (const chapter in data.volumes[volume].chapters) {
            this.chaptersFR.push({ id: data.volumes[volume].chapters[chapter].id, number: data.volumes[volume].chapters[chapter].chapter });
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChapterClickEN(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "en", this.id, item.number, item.id, this.mangaName]);
  }

  onChapterClickFR(item: chapterDisplay) {
    this.router.navigate(['chapterJPG', "fr", this.id, item.number, item.id, this.mangaName]);
  }

  getAlreadyFollow() {
    this.followsService.getData().subscribe(data => {
      data.favories.forEach((element : any) => {
        if (this.mangaName == element.name){
          this.isfollow = true;
          const button = document.querySelector('.follows-button-unfollow');
          if (button) {
            button.classList.add('follows-button-follow');
            button.classList.remove('follows-button-unfollow');
          }
        }else {
          const button = document.querySelector('.follows-button-follow');
          if (button) {
            button.classList.add('follows-button-unfollow');
            button.classList.remove('follows-button-follow');
          }
        }
      });
    });
  }

  followButtonClicked() {
    if(!this.isfollow){
      this.mangaAPIService.getCoverManga(this.id).subscribe(
        (cover: any) => {   
          this.followsService.addFavorite({id: this.id, name: this.mangaName, cover: cover.data[0].attributes.fileName});
          console.log("oui")
        }
      );
    }
    else {
      this.followsService.removeFavorite(this.id);
      console.log("non")
    }
    this.followsService.getData().subscribe(data => {
      console.log(data)
    })
  }
}