import { IUserRole } from "./IUserRole";

export interface IUserModel {
    id: any
    userId?: number;
    employeeId: number;
    userName?: string;
    email: string;
    password: string;
    confirmPassword: string;
    userRoles: IUserRole[];
}