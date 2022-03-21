import { IDispatchNoteLines } from "./IDispatchNoteLines";

export interface IDispatchNote {
    id           : number;
    customerId   : number;
    gdnDate : string;
    contact      : string;
    gdnLines: IDispatchNoteLines[];
    isSubmit?: any;
}
