import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCustodiosComponent } from './mostrar-custodios.component';

describe('MostrarCustodiosComponent', () => {
  let component: MostrarCustodiosComponent;
  let fixture: ComponentFixture<MostrarCustodiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCustodiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCustodiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
