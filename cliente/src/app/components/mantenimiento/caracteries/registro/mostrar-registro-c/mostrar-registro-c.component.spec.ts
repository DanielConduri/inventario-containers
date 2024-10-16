import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarRegistroCComponent } from './mostrar-registro-c.component';

describe('MostrarRegistroCComponent', () => {
  let component: MostrarRegistroCComponent;
  let fixture: ComponentFixture<MostrarRegistroCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarRegistroCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarRegistroCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
