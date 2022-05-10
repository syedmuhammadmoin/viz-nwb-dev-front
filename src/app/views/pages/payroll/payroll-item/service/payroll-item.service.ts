import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Injectable({
  providedIn: 'root'
})

export class PayrollItemService {

  baseUrl = environment.baseUrl + 'payrollItem';

    constructor(private httpClient: HttpClient) { }

    // getInvoices(): Observable<IPaginationResponse<IInvoice[]>> {
    //     return this.httpClient.get<IPaginationResponse<IInvoice[]>>(this.baseUrl)
    //         .pipe(catchError(this.handleError));
    // }

    getEmployees(): Observable<IPaginationResponse<any[]>> {
        return this.httpClient.get<IPaginationResponse<any[]>>(environment.baseUrl + 'employee', { headers: new HttpHeaders().set("key", "b4!V47w^e3QhItW_XY:jHgWQp%$&93nMS|h)Bj~R0&Q#J1m%lI^;b4C,&]Gf2(H_fu]5&X@1Oy~")})
    }

    // getInvoiceById(id: number): Observable<IApiResponse<IInvoice>> {
    //     return this.httpClient.get<IApiResponse<IInvoice>>(`${this.baseUrl}/${id}`)
    //         .pipe(catchError(this.handleError));
    // }

    // createInvoice(Invoice: IInvoice): Observable<any> {
    //     return this.httpClient.post<any>(this.baseUrl, Invoice, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     });
    // }

    // updateInvoice(invoiceModel: IInvoice): Observable<any> {
    //     return this.httpClient.put<any>(this.baseUrl + `/${invoiceModel.id}`, invoiceModel)
    // }

    // workflow(workflow: IWorkflow): Observable<any> {
    //     return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    // }

    // reconcilePayment(transactionRecon: ITransactionRecon): Observable<any> {
    //     return this.httpClient.post<ITransactionRecon>((environment.baseUrl + 'TransactionRecon'), transactionRecon, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    //         .pipe(catchError(this.handleError));
    // }

}





