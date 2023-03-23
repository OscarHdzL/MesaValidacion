import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFuncionUsuarioComponent } from './modal-funcion-usuario.component';

describe('ModalFuncionUsuarioComponent', () => {
  let component: ModalFuncionUsuarioComponent;
  let fixture: ComponentFixture<ModalFuncionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFuncionUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFuncionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
