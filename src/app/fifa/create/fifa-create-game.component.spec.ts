import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaCreateGameComponent } from './fifa-create-game.component';

describe('FifaCreateGameComponent', () => {
  let component: FifaCreateGameComponent;
  let fixture: ComponentFixture<FifaCreateGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaCreateGameComponent],
    });
    fixture = TestBed.createComponent(FifaCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
