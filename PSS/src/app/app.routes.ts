import { Routes } from '@angular/router';
import { AffichageListMangaComponent } from './affichage-list-manga/affichage-list-manga.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';

export const routes: Routes = [  
    { path: 'lastUpdated', component:  AffichageListMangaComponent},
    { path: 'listChapter/:id', component: AffichageListChapitreComponent },
    { path: 'chapterJPG/:langue/:idManga/:numberChap/:idChap', component:  AffichageChapitreComponent},
];
