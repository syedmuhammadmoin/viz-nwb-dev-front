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
