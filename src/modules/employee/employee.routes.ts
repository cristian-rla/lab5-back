import { Router } from "express";
import type { EmployeeController } from "./employee.controller.js";

export type EmployeeRouter = {
    router : Router
}

export function makeEmployeeRouter(employeeController : EmployeeController){
    const router = Router();
    router.get('/', employeeController.getAllEmployees);
    router.get('/:id', employeeController.getEmployeeById);
    router.post('/', employeeController.createEmployee);
    router.put('/:id', employeeController.updateEmployee);
    router.delete('/:id', employeeController.deleteEmployee);

    return { router };
}