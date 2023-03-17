import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMovimimientosProyectoComponent } from './modal-movimimientos-proyecto.component';

describe('ModalMovimimientosProyectoComponent', () => {
  let component: ModalMovimimientosProyectoComponent;
  let fixture: ComponentFixture<ModalMovimimientosProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMovimimientosProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMovimimientosProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
