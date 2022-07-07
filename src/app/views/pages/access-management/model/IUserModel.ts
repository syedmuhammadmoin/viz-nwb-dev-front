import { IUserRole } from "./IUserRole";

export interface IUserModel {
    id: any
    employeeId: number;
    email: string;
    password: string;
    confirmPassword: string;
    userRoles: IUserRole[];
}