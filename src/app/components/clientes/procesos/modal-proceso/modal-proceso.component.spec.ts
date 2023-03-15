import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcesoComponent } from './modal-proceso.component';

describe('ModalProcesoComponent', () => {
  let component: ModalProcesoComponent;
  let fixture: ComponentFixture<ModalProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
