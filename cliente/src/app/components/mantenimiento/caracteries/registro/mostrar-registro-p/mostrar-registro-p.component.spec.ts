import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarRegistroPComponent } from './mostrar-registro-p.component';

describe('MostrarRegistroPComponent', () => {
  let component: MostrarRegistroPComponent;
  let fixture: ComponentFixture<MostrarRegistroPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarRegistroPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarRegistroPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
