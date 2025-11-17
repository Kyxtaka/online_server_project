import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]);

  constructor() {}
  home() {
    this.router.navigate(['/']);
  }
}
