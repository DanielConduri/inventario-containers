import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarMarcaComponent } from './agregar-marca.component';
import { HttpClientModule } from '@angular/common/http';

describe('AgregarMarcaComponent', () => {
  let component: AgregarMarcaComponent;
  let fixture: ComponentFixture<AgregarMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarMarcaComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // describe('ComponentName', () => {
  //   it('should create', () => {
  //     expect(true).toBeTruthy();
  //   });
  // });
  
});
