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

export interface IAdmissionCriteria {
  id?: number;
  programId?: number;
  program?: string;
  description?: string;
  qualificationId?: number;
  qualification?: string;
  subjectId?: number;
  subject?: string;
  qualificationRequriedMarks?: number;
  isEntryTestRequired?: boolean;
  entryTestDate?: string;
  entryTestRequriedMarks?: number;
  interviewDate?: string;
  isInterviewRequired?: boolean;
}
