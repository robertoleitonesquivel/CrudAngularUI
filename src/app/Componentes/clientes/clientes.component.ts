import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesModel } from 'src/app/Modelos/ClientesModel.interface';
import { ClienteService } from 'src/app/Servicios/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  closeResult = '';
  listClientes: ClientesModel[] = [];
  datos!: ClientesModel;
  frmClientes: FormGroup;
  accion: string = "nuevo";

  constructor(
    private clienteService: ClienteService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {
    this.frmClientes = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }
  createClientes() {

  }

  ngOnInit(): void {
    this.getAllClientes();
  }

  getAllClientes() {
    this.clienteService.getAllClientes().subscribe(
      res => {
        this.listClientes = res;
      },
      error => {
        console.log(error);
      });
  }

  //METODO PARA GUARDAR
  save() {

    this.datos = ({
      Cedula: this.frmClientes.get('cedula')?.value,
      Nombre: this.frmClientes.get('nombre')?.value
    });

    this.cerrarModal();
    this.limpiar();
    this.clienteService.insertClientes(this.datos).subscribe(
      res => {
        this.exitMessage(res);
        this.getAllClientes();
      },
      error => {
        this.errorMessage(error.error);
      });

  }

  delete(cedula: string) {
    this.clienteService.deleteClientes(cedula).subscribe(
      res => {
        this.exitMessage(res);
        this.getAllClientes();
      },
      error => {
        this.errorMessage(error.error);
      });
  }

  editar(value: ClientesModel) {
    this.frmClientes.patchValue({
      cedula: value.Cedula,
      nombre: value.Nombre
    });
  }

  update() {
    this.datos = ({
      Cedula: this.frmClientes.get('cedula')?.value,
      Nombre: this.frmClientes.get('nombre')?.value
    });
    this.cerrarModal();
    this.clienteService.updateClientes(this.datos).subscribe(
      res => {
        this.exitMessage(res);
        this.getAllClientes();
      },
      error => {
        this.errorMessage(error.error);
      });
  }

  //METODO QUE MUESTRA UN MENSAJE DE CONFIRMACION
  confirm(cedula: string) {
    Swal.fire({
      title: 'Confirmación.!!',
      text: "Esta seguró que desea eliminar la cédula: "+cedula,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(cedula);
      }
    });
  }
  //METODO QUE ABRE EL MODAL PARA GUARDAR
  open(content: any, accion: string) {
    this.accion = accion;
    if (this.accion === 'editar')
      this.frmClientes.controls['cedula'].disable();
    else
      this.frmClientes.controls['cedula'].enable();

    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //METODO PARA CERRAR LA MODAL
  cerrarModal() {
    this.modal.dismissAll();
  }

  //METODO PARA MOSTRAR MENSAJES
  errorMessage(msj: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msj,
      showConfirmButton: false,
      timer: 3000
    });
  }
  exitMessage(msj: string) {
    Swal.fire({
      icon: 'success',
      title: 'Exito',
      text: msj,
      showConfirmButton: false,
      timer: 3000
    });
  }
  //METODO PARA LIMPIAR
  limpiar() {
    this.frmClientes.patchValue({ cedula: '', nombre: '' });
  }


}
