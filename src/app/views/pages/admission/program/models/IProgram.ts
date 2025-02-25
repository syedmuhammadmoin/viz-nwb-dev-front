export interface IProgram {
   id?: number;
   name?: string;
   degreeId?: number;
   degree?: string;
   academicDepartmentId?: number;
   academicDepartment?: string;
   totalSemesters?: number;
   semesterCourseList?: ISemesterCoursesList[];
}

export interface ISemesterCoursesList {
   id?: number;
   semesterNumber?: number;
   courseId?: number;
   course?: string;
}
