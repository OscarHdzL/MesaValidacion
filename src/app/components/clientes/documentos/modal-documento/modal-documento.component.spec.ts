import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocumentoComponent } from './modal-documento.component';

describe('ModalDocumentoComponent', () => {
  let component: ModalDocumentoComponent;
  let fixture: ComponentFixture<ModalDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
