import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPeriodoComponent } from './modal-periodo.component';

describe('ModalPeriodoComponent', () => {
  let component: ModalPeriodoComponent;
  let fixture: ComponentFixture<ModalPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPeriodoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
