import { Component, OnInit, ViewChild } from '@angular/core';
import { CamposService } from 'src/app/services/campos.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';



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


@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css']
})
export class CamposComponent implements OnInit {
  @ViewChild('modal') modal: any;

  //FECHA
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


  constructor(
    private camposService: CamposService,
  ){}

  ngOnInit(): void {
    this.parametrosIniciales();
    this.horarios();
  }


  parametrosIniciales(){
    this.camposService.getmap().subscribe((resp:any)=>{
      if(resp){
        const data : any = resp.data
        this.titulo = data.nombre
        this.mapa = data.mapa
        // console.log(' :>> ', this.mapa, data);
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
horarios() {
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
    this.horarios();
    // console.log('Fecha seleccionada:', this.fecha);
  }
}






 // MODAL SOLICITAR
   abrirModal() {
  console.log('in :>> ');
    this.modal.show();  // o utiliza algún método proporcionado por la biblioteca que estés utilizando para modales
  }





}
