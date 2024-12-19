import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolHomeComponent } from './lol-home.component';

describe('LolHomeComponent', () => {
  let component: LolHomeComponent;
  let fixture: ComponentFixture<LolHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LolHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LolHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
