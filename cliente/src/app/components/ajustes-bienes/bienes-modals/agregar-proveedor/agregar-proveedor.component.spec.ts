import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AgregarProveedorComponent } from './agregar-proveedor.component';

describe('AgregarProveedorComponent', () => {
  let component: AgregarProveedorComponent;
  let fixture: ComponentFixture<AgregarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarProveedorComponent ],
      imports: [ HttpClientModule], // Agregando HttpClientModule

    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('ComponentName', () => {
    it('should create', () => {
      expect(true).toBeTruthy();
    });
  });
  

});
