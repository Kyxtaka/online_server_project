import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicordIntegrationComponent } from './dicord-integration.component';

describe('DicordIntegrationComponent', () => {
  let component: DicordIntegrationComponent;
  let fixture: ComponentFixture<DicordIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DicordIntegrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DicordIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
