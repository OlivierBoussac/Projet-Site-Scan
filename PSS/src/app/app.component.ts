import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})

export class AppComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['home']);
  }

}
