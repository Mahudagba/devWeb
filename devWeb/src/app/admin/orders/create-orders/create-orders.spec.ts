import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrders } from './create-orders';

describe('CreateOrders', () => {
  let component: CreateOrders;
  let fixture: ComponentFixture<CreateOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
