import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarNivelComponent } from './editar-nivel.component';

describe('EditarNivelComponent', () => {
  let component: EditarNivelComponent;
  let fixture: ComponentFixture<EditarNivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarNivelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
