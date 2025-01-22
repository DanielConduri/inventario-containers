import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarProveedorComponent } from './modificar-proveedor.component';
import { HttpClientModule } from '@angular/common/http';

describe('ModificarProveedorComponent', () => {
  let component: ModificarProveedorComponent;
  let fixture: ComponentFixture<ModificarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarProveedorComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
