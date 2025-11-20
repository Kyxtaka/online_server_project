import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layouts/footer/footer.component';
import { HeaderComponent } from './core/layouts/header/header.component';

// Bootstrap's JS is exposed globally when included; declare it for TypeScript
declare const bootstrap: any;
declare let toastBootstrap: any;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, FooterComponent, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stmapp';
}



