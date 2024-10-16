import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarUsuariosComponent } from './importar-usuarios.component';

describe('ImportarUsuariosComponent', () => {
  let component: ImportarUsuariosComponent;
  let fixture: ComponentFixture<ImportarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
