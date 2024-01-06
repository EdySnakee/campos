import { Component, OnInit, ViewChild } from '@angular/core';
import { CamposService } from 'src/app/services/campos.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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


  // TABLA
  fecha : string = "2024-01-05";
  displayedColumns: string[] = ['horario', 'campo1', 'campo2', 'campo3','campo4'];
  // dataSource:any = '';
  dataSource: MatTableDataSource<Horario> = new MatTableDataSource<Horario>();



  // PARAMETROS INICIALES
  titulo : string = '';
  mapa : any = '';


  constructor(
    private camposService: CamposService
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



 // MODAL SOLICITAR
   abrirModal() {
  console.log('in :>> ');
    this.modal.show();  // o utiliza algún método proporcionado por la biblioteca que estés utilizando para modales
  }





}
