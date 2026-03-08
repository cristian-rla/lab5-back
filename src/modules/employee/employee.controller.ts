import type { EmployeeService } from "./employee.service.js";
import type { CreateEmployeeDTO, Employee, UpdateEmployeeDTO } from "./employee.types.js";
import type { NextFunction, Request, Response } from "express";
import {z} from 'zod';

export type EmployeeController = {
    getAllEmployees : (req: Request, res:Response) => void;
    getEmployeeById : (req: Request, res:Response) => void;
    createEmployee : (req: Request, res:Response) => void;
    updateEmployee : (req: Request, res:Response) => void;
    deleteEmployee : (req: Request, res:Response) => void;
}

const createEmployee = z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    phone: z.string().min(10).max(20),
    role: z.string().min(2).max(100)
});

const updateEmployeeSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.email().optional(),
    phone: z.string().min(10).max(20).optional(),
    role: z.string().min(2).max(100).optional()
});

export function makeEmployeeController(employeeService : EmployeeService) : EmployeeController{
    return {
        getAllEmployees : async (req : Request, res: Response) => {
            const employees = await employeeService.getAllEmployees();
            if (employees.length == 0){
                res.status(404).send({message : 'No employees found'})
                return;
            }
            res.status(200).send(employees)
        },
        getEmployeeById : async (req : Request, res: Response) => {
            if(!req.params.id){
                res.status(400).send({message : 'Employee id is required'});
                return;
            }
            if(typeof req.params.id !== "string"){
                res.status(400).send({message : 'Employee id must be a string'});
                return;
            }
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeById(id);
            if (!employee) {
                res.status(404).send({message : 'Employee not found'});
                return;
            }
            res.status(200).send(employee);
        },
        createEmployee : async (req : Request, res: Response) => {
            const parsed = createEmployee.parse(req.body);
            if (!parsed) {
                res.status(400).send({message : 'Invalid employee data'});
                return;
            }
            const createdEmployee = await employeeService.createEmployee(parsed);
            if (!createdEmployee){
                res.status(400).send({message: 'Could not add employee'});
                return;
            }
            res.status(200).send({message: 'Employee added successfully', employee: createEmployee});
            
        },
        updateEmployee : async (req : Request, res : Response) => {
            if (!req.params.id){
                res.status(400).send({message : 'Id required for this operation'})
                return;
            }
            if (typeof req.params.id !== "string"){
                res.status(400).send({message: 'Only one id'})
                return;
            }
            const employeeData = updateEmployeeSchema.parse(req.body)
            const updateEmployee = await employeeService.updateEmployee(parseInt(req.params.id), employeeData)
            res.status(200).send({message: 'Employee updated successfully', employee: updateEmployee});
        },
        deleteEmployee : async (req:Request, res:Response) => {
            if(!req.params.id){
                res.status(400).send({message : 'Id required for this operation'})
            }
            if (typeof req.params.id !== "string"){
                res.status(400).send({message: 'Only one id'})
                return;
            }
            await employeeService.deleteEmployee(parseInt(req.params.id));
            res.status(200).send({message: 'Employee deleted successfully'})
        }
    }
}