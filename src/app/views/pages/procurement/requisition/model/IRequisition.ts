import { IRequisitionLines } from "./IRequisitionLines";

export interface IRequisition {
      id: number;
      employeeId: number;
      requisitionDate: string;
      campusId : number;
      isWithoutWorkflow: boolean;
      requisitionLines: IRequisitionLines[];
      isSubmit? : boolean;
}









