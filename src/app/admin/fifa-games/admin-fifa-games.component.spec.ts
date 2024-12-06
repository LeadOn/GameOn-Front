import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFifaGamesComponent } from './admin-fifa-games.component';

describe('AdminFifaGamesComponent', () => {
  let component: AdminFifaGamesComponent;
  let fixture: ComponentFixture<AdminFifaGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFifaGamesComponent],
    });
    fixture = TestBed.createComponent(AdminFifaGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
