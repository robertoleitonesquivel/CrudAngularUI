import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientesModel } from '../Modelos/ClientesModel.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = "http://localHost:9092/";


  constructor(private http: HttpClient) { }

  //METODO PARA OBTENER LOS CLIENTES
  getAllClientes(): Observable<ClientesModel[]> {
    return this.http.get<ClientesModel[]>(`${this.baseUrl}api/Cliente/GetAllClientes`);
  }
  //METODO PARA INSERTAR CLIENTES
  insertClientes(cliente: ClientesModel): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}api/Cliente/InsertClientes`, cliente);
  }
  //METODO PARA ACTUALIZAR CLIENTES
  updateClientes(cliente: ClientesModel): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}api/Cliente/UpdateClientes`, cliente);
  }
  //METODO PARA ELIMINAR CLIENTES
  deleteClientes(cedula: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}api/Cliente/DeleteClientes/${cedula}`, "");
  }

}
