import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() options: string[] = [];
  @Output() search: EventEmitter<any> = new EventEmitter<any>();

  selectedOption: string = '';
  searchValue: string = '';
  showDiv: boolean = true; //true para mostrar las opciones de busqueda y false para ocultarlas
  isInputEnabled: boolean = false;
  formattedOptions: string[] = [];
  inputPattern: string = '';
  estado: string = '';

  activarEstados!: boolean


  constructor() { }

  ngOnInit(): void {
    this.formattedOptions = this.options.map(option => this.formatOption(option));
  }

  // toggleInput() {
  //   this.isInputEnabled = this.selectedOption === '' ? false : true;
  //   console.log(this.isInputEnabled);
  //   this.searchValue = '';
  //   // this.search.emit('');
  // }
  formatOption(option: string): string {
    // Reemplazar guiones bajos por espacios
    let formattedOption = option.replace(/_/g, ' ');

    // Capitalizar la primera letra de cada palabra
    formattedOption = formattedOption.replace(/\b\w/g, char => char.toUpperCase());

    // Realizar otras modificaciones necesarias (faltas ortográficas, etc.)

    return formattedOption;
  }

  setEstado(nuevoEstado: string) {
    this.estado = nuevoEstado;
    this.searchValue = nuevoEstado;
    this.search.emit(this.getSearchRequest());
  }

  toggleInput(op: string){
    //console.log('llega algo ----->', op)
    this.showDiv = false;
    this.selectedOption = op;
    // console.log('selectedOption', this.selectedOption);
    this.isInputEnabled = true;
    this.inputPattern = this.getInputPattern(op);
    this.searchValue = '';
  }

  getInputPattern(option: string): string {
    if (option === 'cedula') {
      return '^[0-9]{0,10}$'; // Solo admite números y máximo 10 caracteres
    } 
    else if (option === 'estados'){
      this.activarEstados = true
      return '^(DESARROLLO|EN PROCESO|FINALIZADO)$'
    }
    else if (option === 'estado') {
      return '^(ACTIVO|INACTIVO)$'; // Solo admite 'ACTIVO' o 'INACTIVO'
    } 
    else {
      return ''; // Patrón vacío para permitir cualquier entrada en otros casos
    }
  }

  onSearch() {
    //combertir en mayusculas todo el string de busqueda
    this.searchValue = this.searchValue.toUpperCase();
    // console.log('searchValue', this.searchValue);
    this.search.emit(this.getSearchRequest());
  }

  getSearchRequest() {
    if(this.selectedOption === 'estados'){
      this.selectedOption = 'estado'
    }
    return {
      size: 10,
      page: 1,
      parameter: this.selectedOption /*=== 'cedula' ? 'str_per_cedula' : 'str_per_estado'*/,
      data: this.searchValue
    };
  }

  restrictInput(event: any): void {
    const pattern = new RegExp(this.inputPattern);
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateInput(): void {
    const pattern = new RegExp(this.inputPattern);
    if (!pattern.test(this.searchValue)) {
      // El valor ingresado no coincide con el patrón, se puede mostrar un mensaje de error o realizar alguna acción
    }
  }

  onClear() {
    this.showDiv = true;
    this.searchValue = '';
    this.selectedOption = '';
    this.inputPattern = '';
    this.isInputEnabled = false;
    this.search.emit('');
    this.activarEstados = false
  }
}
