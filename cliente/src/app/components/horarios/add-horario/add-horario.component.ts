import { Component, OnDestroy, OnInit } from '@angular/core';
import { CentrosService } from 'src/app/core/services/centros.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

type DiasDeLaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

interface Intervalo {
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-add-horario',
  templateUrl: './add-horario.component.html',
  styleUrls: ['./add-horario.component.css']
})
export class AddHorarioComponent implements OnInit, OnDestroy {

  centroSeleccionado!: any;
  isData: boolean = false;
  loading: boolean = true; // Indicador de carga
  dias: DiasDeLaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  horarioBody: any[] = [];
  horarioCentro: Record<DiasDeLaSemana, Intervalo[]> = this.getDefaultHorarioCentro();

  private subscriptions: Subscription = new Subscription();

  constructor(
    private srvCentros: CentrosService,
    private srvHorario: HorarioService,
    private srvModal: ModalService
  ) { }

  agregarIntervalo(dia: DiasDeLaSemana) {
    this.horarioCentro[dia].push({ inicio: '', fin: '' });
  }

  eliminarIntervalo(dia: DiasDeLaSemana, index: number) {
    this.horarioCentro[dia].splice(index, 1);
  }

  ngOnInit() {
    this.subscriptions.add(
      this.srvCentros.SelectCentroSeleccionado$.subscribe(data => {
        this.centroSeleccionado = data;
        this.resetHorario();
        this.cargarHorarioCentro();
      })
    );
  }

  cargarHorarioCentro() {
    this.loading = true; // Empezar el indicador de carga

    this.subscriptions.add(
      this.srvHorario.SelectHorarioCentro$.
      subscribe(data => {
        console.log("Llega horario", data);
        if (data.status) {
          this.horarioBody = data.body;
          this.isData = true;
          this.llenarHorario(1);
        } else {
          this.llenarHorario(0);
        }
        this.loading = false; // Detener el indicador de carga una vez cargados los datos
      }, error => {
        console.error('Error al cargar el horario', error);
        this.loading = false; // Detener el indicador de carga en caso de error
      })
    );
  }

  llenarHorario(num: number) {
    if (num !== 1) {
      console.log('No hay horario');
      this.horarioCentro = this.getDefaultHorarioCentro();
    } else {
      console.log('Hay horario');
      this.horarioCentro = this.horarioBody.reduce((acc: Record<DiasDeLaSemana, Intervalo[]>, item: any) => {
        const dia = item.dia as DiasDeLaSemana;
        acc[dia] = item.intervalos;
        return acc;
      }, {} as Record<DiasDeLaSemana, Intervalo[]>);
    }
  }

  guardarHorario() {
    if (!this.esHorarioCompleto()) {
      // Mostrar mensaje de error o alguna indicación al usuario
      return;
    }

    const horario = Object.entries(this.horarioCentro).map(([dia, intervalos]) => {
      return {
        dia,
        intervalos
      };
    });

    this.srvHorario.crearHorario({
      id_centro: this.centroSeleccionado.id_centro,
      horario
    });

    this.srvModal.closeModal();
  }

  esHorarioCompleto(): boolean {
    for (const dia of this.dias) {
      for (const intervalo of this.horarioCentro[dia]) {
        if (!intervalo.inicio || !intervalo.fin) {
          return false;
        }
      }
    }
    return true;
  }

  resetHorario() {
    this.isData = false;
    this.horarioBody = [];
    this.horarioCentro = this.getDefaultHorarioCentro();
  }

  getDefaultHorarioCentro(): Record<DiasDeLaSemana, Intervalo[]> {
    return {
      Lunes: [{ inicio: '00:00', fin: '00:00' }],
      Martes: [{ inicio: '00:00', fin: '00:00' }],
      Miércoles: [{ inicio: '00:00', fin: '00:00' }],
      Jueves: [{ inicio: '00:00', fin: '00:00' }],
      Viernes: [{ inicio: '00:00', fin: '00:00' }]
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.resetHorario();
  }
}



