import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcesoUsuarioComponent } from './modal-proceso-usuario.component';

describe('ModalProcesoUsuarioComponent', () => {
  let component: ModalProcesoUsuarioComponent;
  let fixture: ComponentFixture<ModalProcesoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProcesoUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProcesoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
