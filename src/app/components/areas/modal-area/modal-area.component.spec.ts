import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAreaComponent } from './modal-area.component';

describe('ModalAreaComponent', () => {
  let component: ModalAreaComponent;
  let fixture: ComponentFixture<ModalAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
