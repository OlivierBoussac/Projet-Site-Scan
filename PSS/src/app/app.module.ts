import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AffichageListChapitreComponent } from './affichage-list-chapitre/affichage-list-chapitre.component';
import { AffichageChapitreComponent } from './affichage-chapitre/affichage-chapitre.component';
import { TestAffichageComponent } from './test-affichage/test-affichage.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule, AppRoutingModule, CommonModule ],
  declarations: [ AffichageListChapitreComponent, AffichageChapitreComponent, TestAffichageComponent ],
  bootstrap:    [ ]
})
export class AppModule { }
