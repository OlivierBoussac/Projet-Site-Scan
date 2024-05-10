import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FollowsService } from '../follows.service';
import { HttpClientModule } from '@angular/common/http';

interface mangaDisplay {
  name: string;
  id: string;
  cover: string;
}

@Component({
  selector: 'app-follows',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './follows.component.html',
  styleUrl: './follows.component.scss'
})
export class FollowsComponent implements OnInit{
  mangaListDisplay : mangaDisplay[] = []

  constructor(
    private followsService: FollowsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.followsService.getData().subscribe(data => {
      data.favories.forEach((element : any) => {
        this.mangaListDisplay.push({name: element.name, id: element.id, cover: element.cover});
      });
    })
  }

  onMangaClick(id: string, name:string): void {
    this.router.navigate(['listChapter', id, name]);
  }
}
