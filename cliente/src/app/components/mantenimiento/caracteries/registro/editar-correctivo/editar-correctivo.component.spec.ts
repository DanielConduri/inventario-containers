import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCorrectivoComponent } from './editar-correctivo.component';

describe('EditarCorrectivoComponent', () => {
  let component: EditarCorrectivoComponent;
  let fixture: ComponentFixture<EditarCorrectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCorrectivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCorrectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
