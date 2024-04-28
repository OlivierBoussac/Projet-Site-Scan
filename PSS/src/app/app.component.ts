import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestAffichageComponent } from './test-affichage/test-affichage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestAffichageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent{
}
