import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSupplierComponent } from './table-supplier.component';

describe('TableSupplierComponent', () => {
  let component: TableSupplierComponent;
  let fixture: ComponentFixture<TableSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
