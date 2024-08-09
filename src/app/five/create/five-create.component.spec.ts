import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFiveComponent } from './five-create.component';

describe('CreateFiveComponent', () => {
  let component: CreateFiveComponent;
  let fixture: ComponentFixture<CreateFiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFiveComponent],
    });
    fixture = TestBed.createComponent(CreateFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
