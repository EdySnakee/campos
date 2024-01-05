import { Component, OnInit } from '@angular/core';
import { CamposService } from 'src/app/services/campos.service';
import { API_CAMPOS } from 'src/config';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  symbol2: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'Ne',symbol2: 'Ne'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'Ne',symbol2: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne',symbol2: 'Ne'},
];

@Component({
  selector: 'app-campos',
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.css']
})
export class CamposComponent implements OnInit {

  // TABLA
  fecha : string = '';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','symbol2'];
  dataSource = ELEMENT_DATA;

  // PARAMETROS INICIALES
  titulo : string = '';
  mapa : any = '';


  constructor(
    private camposService: CamposService
  ){}

  ngOnInit(): void {
    this.parametrosIniciales();
    this.horarios(this.fecha);
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
horarios(fecha:any){
  this.camposService.consultarDisp(fecha).subscribe(
    (resp) => {
      if (resp.ok) {
        console.log('->', resp);

      }
    },
    (error) => {
      console.log('Error de conexión', error);
    }
    );
}




}
