import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarCatalogoComponent } from './importar-catalogo.component';
import { HttpClientModule } from '@angular/common/http';

describe('ImportarCatalogoComponent', () => {
  let component: ImportarCatalogoComponent;
  let fixture: ComponentFixture<ImportarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarCatalogoComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
