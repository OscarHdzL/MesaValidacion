import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoUsuariosComponent } from './proceso-usuarios.component';

describe('ProcesoUsuariosComponent', () => {
  let component: ProcesoUsuariosComponent;
  let fixture: ComponentFixture<ProcesoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
