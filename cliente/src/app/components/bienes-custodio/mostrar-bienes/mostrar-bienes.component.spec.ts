import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarBienesComponent } from './mostrar-bienes.component';

describe('MostrarBienesComponent', () => {
  let component: MostrarBienesComponent;
  let fixture: ComponentFixture<MostrarBienesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarBienesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarBienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
