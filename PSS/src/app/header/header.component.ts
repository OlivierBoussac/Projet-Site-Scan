import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery: string = '';
  mobileMenuOpen: boolean = false;
  
  // Variables pour le formulaire de connexion
  showLoginForm: boolean = false;
  showRegisterForm: boolean = false;
  loginEmail: string = '';
  loginPassword: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerPasswordConfirm: string = '';
  errorMessage: string = '';

  constructor(private router: Router, public authService: AuthService) { }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onMangaKeyUp() {
    this.router.navigate(['listMangaSearch', this.searchQuery]);
    this.closeMobileMenu();
  }

  toggleLoginForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.showRegisterForm = false;
    this.errorMessage = '';
  }

  toggleRegisterForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
    this.showLoginForm = false;
    this.errorMessage = '';
  }

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: () => {
        this.showLoginForm = false;
        this.loginEmail = '';
        this.loginPassword = '';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }

  onRegister(): void {
    if (!this.registerEmail || !this.registerPassword || !this.registerPasswordConfirm) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.authService.register({ email: this.registerEmail, password: this.registerPassword }).subscribe({
      next: () => {
        this.showRegisterForm = false;
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerPasswordConfirm = '';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
        this.errorMessage = 'Erreur lors de l\'inscription';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }
}