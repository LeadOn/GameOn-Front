import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolPlayerDetailsComponent } from './lol-player-details.component';

describe('LolPlayerDetailsComponent', () => {
  let component: LolPlayerDetailsComponent;
  let fixture: ComponentFixture<LolPlayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LolPlayerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LolPlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
