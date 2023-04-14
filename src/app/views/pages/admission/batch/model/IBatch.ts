import {IAdmissionCriteria} from '../../admission-criteria/model/IAdmissionCriteria';

export interface IBatch {
  id?: any;
  name?: string;
  startDate?: string;
  semesterId?: number;
  semester?: string;
  campusId?: number;
  campus?: string;
  shiftId?: number;
  shift?: string;
  isAdmissionOpen?: boolean;
  batchLines?: IBatchLines[];
  admissionCriteria?: IAdmissionCriteria[];
}

export interface IBatchLines {
  id?: any
  programId?: number;
  program?: string;
  masterId?: number;
}
