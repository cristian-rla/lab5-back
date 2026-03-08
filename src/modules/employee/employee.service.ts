import type { EmployeeRepo } from "./employee.repo.js";
import type { CreateEmployeeDTO, Employee, UpdateEmployeeDTO } from "./employee.types.js";

export type EmployeeService = {
    getAllEmployees : () => Promise<Employee[]>;
    getEmployeeById : (id:number) => Promise<Employee | null>;
    createEmployee : (newEmployee : CreateEmployeeDTO) => Promise<Employee | null>;
    updateEmployee : (id : number, employeeUpdate : UpdateEmployeeDTO) => Promise<Employee | null>;
    deleteEmployee : (id:number) => Promise<void>;
}

export function makeEmployeeService(employeeRepo : EmployeeRepo){
    return {
        getAllEmployees : async () => {
            return await employeeRepo.getAllEmployees();
        },
        getEmployeeById : async (id:number) => {
            return await employeeRepo.getEmployeeById(id)
        },
        createEmployee : async (employee : CreateEmployeeDTO) => {
            return await employeeRepo.createEmployee(employee);
        },
        updateEmployee: async (id: number, employeeUpdate : UpdateEmployeeDTO) => {
            return await employeeRepo.updateEmployee(id, employeeUpdate);
        },
        deleteEmployee : async (id:number) => {
            await employeeRepo.deleteEmployee(id);
        }
    }
}