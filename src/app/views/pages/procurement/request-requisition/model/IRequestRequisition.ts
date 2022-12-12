import { IRequestRequisitionLines } from "./IRequestRequisitionLine";


export interface IRequestRequisition {
      id: number;
      employeeId: number;
      requisitionDate: string;
      campusId : number;
      requestRequisitionLines: IRequestRequisitionLines[];
      isSubmit? : boolean;
}










