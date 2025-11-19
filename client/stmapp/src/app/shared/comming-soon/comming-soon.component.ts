import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comming-soon',
  imports: [CommonModule],
  templateUrl: './comming-soon.component.html',
  styleUrl: './comming-soon.component.css',
})
export class CommingSoonComponent {

  public featureName: WritableSignal<string> = signal('Feature');
  public featureDescription: WritableSignal<string> = signal('This feature is under development and will be available soon. Stay tuned for updates!');
  public hasProjectedActions: WritableSignal<boolean> = signal(false);

  constructor() {}
}
