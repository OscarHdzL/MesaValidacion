import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocInfoComponent } from './modal-doc-info.component';

describe('ModalDocInfoComponent', () => {
  let component: ModalDocInfoComponent;
  let fixture: ComponentFixture<ModalDocInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDocInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDocInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
