import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForoComponent } from './modal-foro.component';

describe('ModalForoComponent', () => {
  let component: ModalForoComponent;
  let fixture: ComponentFixture<ModalForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalForoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
