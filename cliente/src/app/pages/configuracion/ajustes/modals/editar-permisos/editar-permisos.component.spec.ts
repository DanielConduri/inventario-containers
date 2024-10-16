import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPermisosComponent } from './editar-permisos.component';

describe('EditarPermisosComponent', () => {
  let component: EditarPermisosComponent;
  let fixture: ComponentFixture<EditarPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPermisosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
