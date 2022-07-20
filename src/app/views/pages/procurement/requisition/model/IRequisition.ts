import { IRequisitionLines } from "./IRequisitionLines";

export interface IRequisition {
      id: number;
      employeeId: number;
      requisitionDate: string;
      campusId : number;
      requisitionLines: IRequisitionLines[];
      isSubmit? : boolean;
}










