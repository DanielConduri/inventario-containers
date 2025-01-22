import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialArchivosComponent } from './historial-archivos.component';
import { HttpClientModule } from '@angular/common/http';

describe('HistorialArchivosComponent', () => {
  let component: HistorialArchivosComponent;
  let fixture: ComponentFixture<HistorialArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialArchivosComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 
});
