import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarSubmenuComponent } from './mostrar-submenu.component';

describe('MostrarSubmenuComponent', () => {
  let component: MostrarSubmenuComponent;
  let fixture: ComponentFixture<MostrarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarSubmenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
