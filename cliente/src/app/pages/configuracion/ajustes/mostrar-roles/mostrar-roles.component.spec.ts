import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarRolesComponent } from './mostrar-roles.component';

describe('MostrarRolesComponent', () => {
  let component: MostrarRolesComponent;
  let fixture: ComponentFixture<MostrarRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
