import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RayCastingComponent } from './ray-casting.component';

describe('RayCastingComponent', () => {
  let component: RayCastingComponent;
  let fixture: ComponentFixture<RayCastingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RayCastingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RayCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
