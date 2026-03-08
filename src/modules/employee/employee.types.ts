export type Employee = {
    id: number,
    name : string, 
    email : string, 
    phone : string, 
    role : string
}

export type CreateEmployeeDTO = Omit<Employee, 'id'> 

export type UpdateEmployeeDTO = {
    name? : string | undefined, 
    email? : string | undefined, 
    phone? : string | undefined, 
    role? : string | undefined
}