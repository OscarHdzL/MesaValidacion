import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHistoricoComponent } from './tab-historico.component';

describe('TabHistoricoComponent', () => {
  let component: TabHistoricoComponent;
  let fixture: ComponentFixture<TabHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabHistoricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
