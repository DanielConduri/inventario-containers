import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSoporteComponent } from './tipo-soporte.component';

describe('TipoSoporteComponent', () => {
  let component: TipoSoporteComponent;
  let fixture: ComponentFixture<TipoSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoSoporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
