import { Routes } from '@angular/router';
import { AffichageListMangaComponent } from './affichage-list-manga/affichage-list-manga.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SearchListMangaComponent } from './search-list-manga/search-list-manga.component';

export const routes: Routes = [  
    { path: 'home', component: HomePageComponent },
    { path: 'lastUpdated', component:  AffichageListMangaComponent},
    { path: 'listChapter/:id', component: AffichageListChapitreComponent },
    { path: 'listMangaSearch/:mangaName', component: SearchListMangaComponent },
    { path: 'chapterJPG/:langue/:idManga/:numberChap/:idChap', component:  AffichageChapitreComponent},
];
