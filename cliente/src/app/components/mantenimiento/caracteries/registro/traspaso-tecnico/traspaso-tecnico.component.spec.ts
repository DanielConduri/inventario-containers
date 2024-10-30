import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoTecnicoComponent } from './traspaso-tecnico.component';

describe('TraspasoTecnicoComponent', () => {
  let component: TraspasoTecnicoComponent;
  let fixture: ComponentFixture<TraspasoTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraspasoTecnicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraspasoTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
