import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountinformationComponent } from './accountinformation.component';

describe('AccountinformationComponent', () => {
  let component: AccountinformationComponent;
  let fixture: ComponentFixture<AccountinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountinformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
