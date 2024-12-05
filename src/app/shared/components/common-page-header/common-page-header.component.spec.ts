import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPageHeaderComponent } from './common-page-header.component';

describe('CommonPageHeaderComponent', () => {
  let component: CommonPageHeaderComponent;
  let fixture: ComponentFixture<CommonPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonPageHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
