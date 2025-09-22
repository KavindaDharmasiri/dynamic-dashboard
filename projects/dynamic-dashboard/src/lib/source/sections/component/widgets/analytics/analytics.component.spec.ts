import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnelaticsComponent } from './anelatics.component';

describe('AnelaticsComponent', () => {
  let component: AnelaticsComponent;
  let fixture: ComponentFixture<AnelaticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnelaticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnelaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
