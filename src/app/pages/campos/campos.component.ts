import { Component, OnInit, ViewChild } from '@angular/core';
import { CamposService } from 'src/app/services/campos.service';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';



import { API_CAMPOS } from 'src/config';



interface Campo {
  id_campo: number;
  clave: string;
  campo: string;
  status: string;
  folio: string;
  id_solicitud: number;
}

interface Horario {
  fecha: string;
  id_horario: number;
  horario: string;
  campos: Campo[];
}

interface HorariosResponse {
  ok: any;
  data: Horario[];
}

interface Detalles {
  id_detalle: number;
  campo : string;
  nombre_solicitante:string;
  correo_solicitante: string;
  celular_solicitante:string;
  fecha_solicitud: string;
  horario: string;
}



@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css']
})
export class CamposComponent implements OnInit {

// MODAL
  modalOpen : boolean = false;
  disableSelect = new FormControl(false);
  @ViewChild('modal') modal: any;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
// DATOS DEL MODAL SOLICITUD
date2 = new FormControl(new Date());
date3 = new FormControl(new Date());
nombre : string = '';
correo : string = '';
celular : string = '';
local : string = '';
motivo : string = '';
fechaInicio : Date | null | undefined = null;
fechaFinal : Date | null | undefined = null;
horarios = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
 '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00','22:00', '23:00'];
 selectedHorario: string = '';
// campos = ['Campo1', 'Campo2', 'Campo3', 'Campo4']


  //FECHA
  fechaActual: any = '';
  date = new FormControl(new Date());
  selectedDate: Date | null | undefined = null;


  // TABLA
  fecha : string = "2024-01-05";
  displayedColumns: string[] = ['horario', 'campo1', 'campo2', 'campo3','campo4'];
  dataSource: MatTableDataSource<Horario> = new MatTableDataSource<Horario>();

  getCellStyle(status: string): any {
    switch (status) {
      case 'DISPONIBLE':
        return { 'background-color': 'rgb(241 241 241 / 80%)' };
      case 'RESERVADO':
        return { 'background-color': 'rgb(236 233 29 / 77%)' };
      case 'OCUPADO':
        return { 'background-color': 'rgb(55 236 55 / 80%)'};
      default:
        return {}; // Puedes ajustar esto según tus necesidades
    }
  }



  // PARAMETROS INICIALES
  titulo : string = '';
  mapa : any = '';
  mapa2 : any = '';


  constructor(
    private camposService: CamposService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    const fechaHoy = new Date();
    this.fechaActual = this.datePipe.transform(fechaHoy, 'EEEE d MMMM yyyy', 'es');
    console.log('fecha :>> ', this.fechaActual);
    this.parametrosIniciales();
    this.getHorarios();
  }

  svgData: string = '';
  campoSelect(event: any) {
    // const targetElement = event.target as SVGElement;
    console.log('e.targ->', event.target);
  }


  // PARA EL SVG
  selectHorario!: string; // Asumiendo que el tipo de datos de campos es string[]
  selectedStyle!: any ; // Puedes ajustar el tipo según tus necesidades

  campos = ['CANCHA1', 'CANCHA2', 'CANCHA3', 'CANCHA4'];

  // Define estilos para cada CANCHA
  styles:any = {

    CANCHA4: {
          fill: 'none',
          cursor: 'pointer'
    },

      CANCHA2: {
          '.cls-18': {
            fill: 'rgba(135, 201, 35, 0.718)',
            cursor: 'pointer'
          }
      },

      CANCHA3: {
        hover: {
        fill: 'rgba(135, 201, 35, 0.718)',
        cursor: 'pointer'
      }
      },
     CANCHA1: {
      hover: {
        fill: 'rgba(135, 201, 35, 0.718)',
        cursor: 'pointer'
      }
        }

  };

  // Método para aplicar el estilo según la opción seleccionada
  applyStyles() {
    this.selectedStyle = this.styles[this.selectHorario];
    console.log(':>> ',this.selectedStyle);
  }


  parametrosIniciales(){
    this.camposService.getmap().subscribe((resp:any)=>{
      if(resp){
        const data : any = resp.data
        const map : any = resp.data.mapa
        this.titulo = data.nombre
        this.mapa = this.sanitizer.bypassSecurityTrustHtml(map);
         console.log(' :>> ', this.mapa);
      }else {
        console.log(' :>> ',resp);
      }
    })
  }

  // IMAGEN SVG SEGURA
  getSvgUrl(svgContent: string): string {
    // Codificar el contenido SVG correctamente
    const encodedSvg = encodeURIComponent(svgContent);
    // Construir la URL de la imagen SVG
    return 'data:image/svg+xml,' + encodedSvg;
  }



  obtenerCampos(){
    this.camposService.getCampo().subscribe((resp)=>{
      if(resp){
        console.log(' :>> ',resp);
      }else {
        console.log(' :>> ',resp);

      }
    })
  }

//HORARIOS DE TABLA DE DISPONIBILIDAD
getHorarios() {
   let json = {
    fecha : this.fecha
   }
  this.camposService.consultarDisp(json).subscribe(
    (resp: HorariosResponse) => {
      if (resp.ok) {
        this.dataSource.data = resp.data;
        console.log(':>> ', resp);
        // console.log(':>> ', fecha);
      }
    },
    (error) => {
      console.log('Error de conexión al obtener horarios: ', error);
    }
  );




}


// FECHAS
cambioFecha(event: MatDatepickerInputEvent<Date>) {
  this.selectedDate = event.value;
  this.filtrarHorario(this.selectedDate);
}

filtrarHorario(fecha: Date | null) {
  if (fecha) {
    let fechaString = fecha.toISOString().split('T');
    this.fecha = fechaString[0];
    this.getHorarios()
    // console.log('Fecha seleccionada:', this.fecha);
  }
}






 // MODAL SOLICITAR
   abrirModal() {
  console.log('in :>> ');
    this.modal.show();  // o utiliza algún método proporcionado por la biblioteca que estés utilizando para modales
  }


  cambioFechaInicio(event: MatDatepickerInputEvent<Date>) {
    const f = event.value;
    const fechaFormateada : any = f?.toISOString().split('T');
    this.fechaInicio = fechaFormateada[0];
  }

  cambioFechaFinal(event: MatDatepickerInputEvent<Date>) {
    const f = event.value;
    const fechaFormateada : any = f?.toISOString().split('T');
    this.fechaFinal = fechaFormateada[0];
  }


enviarSolicitud(){
  // const fechaActual = this.datePipe.transform(this.fechaInicio, 'dd/MM/yyyy');
  let json = {
    id_soli : 0,
    nombre_solicitud : this.nombre,
    correo : this.correo,
    celular: this.celular,
    local : this.local,
    motivo: this.motivo,
    fecha_inicial: '' || this.fechaInicio,
    fecha_final: '' || this.fechaFinal,
    fecha_actual: this.fechaActual,
    horario: this.selectedHorario,
  }
  //do somting
  console.log('json :>> ', json);
}
// MODAL HORARIO
idHorario: number = 0;
fechaHorario : string = '';
horarioH : string = '';
camposHorarios: [] = [];
horarioDetalles: Detalles[] = [];
noHaydatos:boolean = false;


detallesHorario(horario:any){
  this.horarioDetalles = [];
  this.fechaHorario = horario.fecha.toString().split(' ')[0];
  this.horarioH = horario.horario;
  this.camposHorarios = horario.campos;
  this.idHorario = horario.id_horario;
// console.log('horario :>> ', this.camposHorarios );
this.consultarHorarios();
}

//conultar horarios
consultarHorarios(){
  let json = {
    id_horario : this.idHorario ,
    fecha : this.fechaHorario
  }
  this.camposService.consultarSoli(json).subscribe((resp:any)=>{
    if(resp.ok){
      this.horarioDetalles = resp.data;
      console.log('resp :>> ', this.horarioDetalles);
    }else {
      this.horarioDetalles = [];
    }
  })


}


}
