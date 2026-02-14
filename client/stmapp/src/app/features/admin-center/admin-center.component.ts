import { Component, OnInit, computed, signal, inject, effect, Signal } from '@angular/core';
import { AppRoutes } from '../../app.routes';
import { faUser, faLock, faBell, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommingSoonComponent } from '../../shared/comming-soon/comming-soon.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-admin-center',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule, CommingSoonComponent],
  templateUrl: './admin-center.component.html',
  styleUrls: ['./admin-center.component.css']
})
export class AdminCenterComponent implements OnInit {

  // Icons
  public faUser = faUser
  public faLock = faLock
  public faBell = faBell
  public faDiscord = faDiscord
  public faPhone = faPhone

  // Routes
  public AppRoutes = AppRoutes;

  private router: Router = inject(Router);

  private urlSignal: Signal<NavigationEnd> = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    ),
    { initialValue: { url: this.router.url } as NavigationEnd },
  );

  public currentSection: Signal<string> = computed(() => {
    const url = this.urlSignal().url;
    const segments = url.split('/').filter((s) => s.length > 0);
    return segments.length > 1 ? segments[1] : 'personnal';
  });

  constructor() {
    effect(() => {
      console.log('URL changed:', this.urlSignal().url);
      console.log('Current section:', this.currentSection());
    });
  }

  ngOnInit(): void {
  }
}
