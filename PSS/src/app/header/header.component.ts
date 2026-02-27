import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery: string = '';

  constructor(private router: Router) { }

  onClickGoHome() {
    this.router.navigate(['home']);
  }

  onClickGoLastUpdated() {
    this.router.navigate(['lastUpdated']);
  }

  onMangaKeyUp() {
    this.router.navigate(['listMangaSearch', this.searchQuery]);
  }
}