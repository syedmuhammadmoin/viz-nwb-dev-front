import { Injectable } from '@angular/core';
import Swal, {SweetAlertOptions} from 'sweetalert2'

@Injectable()
export class SweetAlertService {

  constructor() {
  }

  createAlert(sweetAlertOptions: SweetAlertOptions): Promise<any> {
    return Swal.fire(sweetAlertOptions);
  }
}
