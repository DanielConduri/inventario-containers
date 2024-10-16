import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarMenuComponent } from './modificar-menu.component';

describe('ModificarMenuComponent', () => {
  let component: ModificarMenuComponent;
  let fixture: ComponentFixture<ModificarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
