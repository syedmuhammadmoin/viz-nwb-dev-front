import { IRequisitionLines } from "./IRequisitionLines";

export interface IRequisition {
      id: number;
      businessPartnerId: number;
      requisitionDate: string;
      description: string;
      contact: string
      campusId : number;
      requisitionLines: IRequisitionLines[];
      isSubmit? : boolean;
}










