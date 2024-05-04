import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [    
    FormsModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor( private router: Router) { }

  onClickGoHome(){
    this.router.navigate(['home']);
  }

  onClickGoLastUpdated() {
    this.router.navigate(['lastUpdated']);
  }

  onMangaKeyUp(manga: any): void {
    this.router.navigate(['listMangaSearch', manga.target.value]);
  }
}
