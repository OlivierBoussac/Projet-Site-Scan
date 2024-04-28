import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet],
})

export class AppComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['lastUpdated']);
  }

}
