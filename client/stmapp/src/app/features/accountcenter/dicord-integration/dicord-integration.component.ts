import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { CommingSoonComponent } from '../../../shared/comming-soon/comming-soon.component';
@Component({
  selector: 'app-dicord-integration',
  imports: [CommonModule, FontAwesomeModule, CommingSoonComponent],
  templateUrl: './dicord-integration.component.html',
  styleUrl: './dicord-integration.component.css',
})
export class DicordIntegrationComponent {


  constructor() {}
}
