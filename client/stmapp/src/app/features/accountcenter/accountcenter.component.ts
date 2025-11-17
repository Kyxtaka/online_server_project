import { Component, computed, inject, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountInformationComponent } from './accountinformation/accountinformation.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { AppRoutes } from '../../app.routes';
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faUser, faShield, faBell} from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { AccountSecurityComponent } from './accountsecurity/accountsecurity.component';


@Component({
    selector: 'app-account-center',
    standalone: true,
    imports: [CommonModule, AccountInformationComponent, NotFoundComponent, RouterLink, FaIconComponent, FontAwesomeModule, AccountSecurityComponent],
    templateUrl: './accountcenter.component.html',
    styleUrls: ['./accountcenter.component.css']
})
export class AccountCenterComponent {
  private router: Router = inject(Router);

  // Icons
  public faUser = faUser;
  public faShield = faShield;
  public faBell = faBell;
  public faDiscord = faDiscord;
  // public faBellRegular = faBellRegular;

  // Routes
  public AppRoutes = AppRoutes;



  private urlSignal: Signal<NavigationEnd> = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ),
    { initialValue: { url: this.router.url } as NavigationEnd }
  );

  public currentSection: Signal<string> = computed(() => {
    const url = this.urlSignal().url;
    const segments = url.split('/').filter(s => s.length > 0);
    return segments.length > 1 ? segments[1] : 'personnal';
  });

  constructor() {
    effect(() => {
      console.log("URL changed:", this.urlSignal().url);
      console.log('Current section:', this.currentSection());
    });
  }

}
