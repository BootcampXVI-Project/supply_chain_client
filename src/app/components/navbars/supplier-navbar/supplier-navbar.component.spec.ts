import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierNavbarComponent } from './supplier-navbar.component';

describe('SupplierNavbarComponent', () => {
  let component: SupplierNavbarComponent;
  let fixture: ComponentFixture<SupplierNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
