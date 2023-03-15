import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartidaComponent } from './modal-partida.component';

describe('ModalPartidaComponent', () => {
  let component: ModalPartidaComponent;
  let fixture: ComponentFixture<ModalPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPartidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
