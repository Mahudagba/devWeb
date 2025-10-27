import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayaout } from './admin-layaout';

describe('AdminLayaout', () => {
  let component: AdminLayaout;
  let fixture: ComponentFixture<AdminLayaout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayaout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayaout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
