import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCentrosComponent } from './mostrar-centros.component';

describe('MostrarCentrosComponent', () => {
  let component: MostrarCentrosComponent;
  let fixture: ComponentFixture<MostrarCentrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCentrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
