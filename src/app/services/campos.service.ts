import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CAMPOS } from 'src/config';
import { Observable, catchError, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CamposService {

  constructor(
    private http : HttpClient
  ) { }

  private handleError(error: any): Observable<never> {
    // lógica de errores FALTANTE
    console.error('Ocurrió un error:', error);
    throw error;
  }


  // OBTENER PARAMETROS INICIALES
  getmap(){
    return this.http.get(API_CAMPOS + '/consultarParametros')
    .pipe(
      catchError(this.handleError)
    );
  }


// OBTENER CAMPOS
    getCampo(){
      return this.http.get(API_CAMPOS + '/consultarCampo')
      .pipe(
        catchError(this.handleError)
      );
    }


// CONSULTAR DISPONIBILIDADES
    consultarDisp(json:any){
      let url = API_CAMPOS+'/consultarDisponibilidad';
      return this.http.post( url, json )
        .pipe(map( (resp: any) => {
          return resp;
        }), catchError(this.handleError));
    }



  // CONSULTAR SOLICITUDES
    consultarSoli(json:any){
      let url = API_CAMPOS+'/consultarSolicitud';
      return this.http.post( url, json )
        .pipe(map( (resp: any) => {
          return resp;
        }), catchError(this.handleError));
    }





}
