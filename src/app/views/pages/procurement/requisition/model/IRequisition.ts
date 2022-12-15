import { IRequisitionLines } from "./IRequisitionLines";

export interface IRequisition {
      id: number;
      employeeId: number;
      requisitionDate: string;
      campusId : number;
      requestId : number;
      isWithoutWorkflow: boolean;
      requisitionLines: IRequisitionLines[];
      isSubmit? : boolean;
}









