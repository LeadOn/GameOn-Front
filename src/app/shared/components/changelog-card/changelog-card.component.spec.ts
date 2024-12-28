import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogCardComponent } from './changelog-card.component';

describe('ChangelogCardComponent', () => {
  let component: ChangelogCardComponent;
  let fixture: ComponentFixture<ChangelogCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelogCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
