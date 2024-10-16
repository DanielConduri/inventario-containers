import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPerRolComponent } from './mostrar-per-rol.component';

describe('MostrarPerRolComponent', () => {
  let component: MostrarPerRolComponent;
  let fixture: ComponentFixture<MostrarPerRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarPerRolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarPerRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
