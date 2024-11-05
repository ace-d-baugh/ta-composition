import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBidsComponent } from './line-bids.component';

describe('LineBidsComponent', () => {
  let component: LineBidsComponent;
  let fixture: ComponentFixture<LineBidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineBidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
