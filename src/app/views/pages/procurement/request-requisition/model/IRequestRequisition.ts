import { IRequestRequisitionLines } from "./IRequestRequisitionLine";


export interface IRequestRequisition {
      id: number;
      employeeId: number;
      requestDate: string;
      campusId : number;
      requestLines: IRequestRequisitionLines[];
      isSubmit? : boolean;
}









