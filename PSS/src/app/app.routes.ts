import { Routes } from '@angular/router';
import { AffichageListMangaComponent } from './affichage-list-manga/affichage-list-manga.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SearchListMangaComponent } from './search-list-manga/search-list-manga.component';
import { FollowsComponent } from './follows/follows.component';

export const routes: Routes = [  
    { path: 'home', component: HomePageComponent },
    { path: 'follows', component: FollowsComponent },
    { path: 'lastUpdated', component:  AffichageListMangaComponent},
    { path: 'listChapter/:id/:mangaName', component: AffichageListChapitreComponent },
    { path: 'listMangaSearch/:mangaName', component: SearchListMangaComponent },
    { path: 'chapterJPG/:langue/:idManga/:numberChap/:idChap/:mangaName', component:  AffichageChapitreComponent},
];
