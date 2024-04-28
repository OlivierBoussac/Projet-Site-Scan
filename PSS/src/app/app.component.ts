import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { Router } from '@angular/router';

import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { TestAffichageComponent } from './test-affichage/test-affichage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/listChapter']);
  }

}
