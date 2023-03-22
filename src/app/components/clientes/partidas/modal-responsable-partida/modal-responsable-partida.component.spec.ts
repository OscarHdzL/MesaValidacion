import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResponsablePartidaComponent } from './modal-responsable-partida.component';

describe('ModalResponsablePartidaComponent', () => {
  let component: ModalResponsablePartidaComponent;
  let fixture: ComponentFixture<ModalResponsablePartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResponsablePartidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResponsablePartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
