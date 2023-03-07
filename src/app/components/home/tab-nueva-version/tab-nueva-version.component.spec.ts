import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabNuevaVersionComponent } from './tab-nueva-version.component';

describe('TabNuevaVersionComponent', () => {
  let component: TabNuevaVersionComponent;
  let fixture: ComponentFixture<TabNuevaVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabNuevaVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabNuevaVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
