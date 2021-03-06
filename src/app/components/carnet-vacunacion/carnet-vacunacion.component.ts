import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Dosis, RangosDeEdad, Vacuna } from 'src/app/models/vacuna.model';
import { IngresoService } from 'src/app/services/ingreso/ingreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carnet-vacunacion',
  templateUrl: './carnet-vacunacion.component.html',
  styleUrls: ['./carnet-vacunacion.component.scss'],
})
export class CarnetVacunacionComponent {
  @Input() busquedaUsuario: UsuarioModel[] = [];
  @Output() onIngresoUsuario = new EventEmitter<string>();

  ingreso: boolean = false;
  voluntario: UsuarioModel;
  fecha = new Date().toLocaleDateString('en-CA');

  constructor(
    private ingresoServices: IngresoService,

    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.busquedaUsuario) {
      let edad = this.validarFecha(changes.busquedaUsuario.currentValue[0]?.fecha_nacimiento);

      if (
        (changes.busquedaUsuario.currentValue[0]?.id_vacuna === Vacuna.JOHNSON_JOHNSON ||
          changes.busquedaUsuario.currentValue[0]?.id_vacuna === Vacuna.SINOPHARM ||
          changes.busquedaUsuario.currentValue[0]?.id_dosis >= Dosis.DOS_DOSIS) &&
        !!changes.busquedaUsuario.currentValue[0]?.carnet
      ) {
        this.ingreso = true;
      } else if (
        edad > RangosDeEdad.SIN_VACUNA &&
        edad <= RangosDeEdad.UNA_VACUNA &&
        changes.busquedaUsuario.currentValue[0]?.carnet
      ) {
        this.ingreso = true;
      } else if (edad <= RangosDeEdad.SIN_VACUNA) {
        this.ingreso = true;
      } else {
        this.ingreso = false;
      }
    }
  }

  validarFecha(fecha: Date) {
    const years = Math.floor(moment().diff(moment(fecha), 'years', true));
    return years;
  }

  darIngreso() {
    let idVoluntario = localStorage.getItem('idUsuario');
    let idUsuario = this.busquedaUsuario[0].id;
    let congregacionIngreso = localStorage.getItem('congregacion_ingreso');
    let primerNombre = this.busquedaUsuario[0].primer_nombre;
    let segundoNombre = this.busquedaUsuario[0].segundo_nombre;
    let primerApellido = this.busquedaUsuario[0].primer_apellido;
    let segundoApellido = this.busquedaUsuario[0].segundo_apellido;

    this.ingresoServices.crearIngreso(idVoluntario, idUsuario, congregacionIngreso, this.fecha).subscribe(
      (ingresoCreado: any) => {
        Swal.fire(
          '??Ingreso Exitoso!',
          `Bienvenido ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`,
          'success'
        );
      },
      (err) => {
        Swal.fire({
          html: 'Debe iniciar sesi??n',
          icon: 'error',
        });
        this.router.navigateByUrl('/login');
      }
    );

    this.onIngresoUsuario.emit(idUsuario);
  }
}
