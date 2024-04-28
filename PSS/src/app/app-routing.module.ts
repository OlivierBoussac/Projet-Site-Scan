import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { TestAffichageComponent } from './test-affichage/test-affichage.component';

const routes: Routes = [
  { path: 'lastUpdated', component:  TestAffichageComponent},
  { path: 'listChapter', component: AffichageListChapitreComponent },
  { path: 'chapterJPG', component:  AffichageChapitreComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)], // Utilisez forRoot dans le module racine
  exports: [RouterModule]
})

export class AppRoutingModule { }