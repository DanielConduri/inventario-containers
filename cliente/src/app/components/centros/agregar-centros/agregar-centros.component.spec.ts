import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCentrosComponent } from './agregar-centros.component';

describe('AgregarCentrosComponent', () => {
  let component: AgregarCentrosComponent;
  let fixture: ComponentFixture<AgregarCentrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarCentrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
