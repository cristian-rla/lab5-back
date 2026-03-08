import type { Db } from "../../infra/db/db.js"
import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from "./employee.types.js"

export type EmployeeRepo = {
    getAllEmployees : () => Promise<Employee[]>;
    getEmployeeById : (id:number) => Promise<Employee>;
    createEmployee : (employeeData: CreateEmployeeDTO) => Promise<Employee>;
    updateEmployee : (id: number, employeeData: UpdateEmployeeDTO) => Promise<Employee>;
    deleteEmployee : (id: number) => Promise<number>;
}

export function makeEmployeeRepo(db : Db) : EmployeeRepo{
    const getAllEmployees = async () => {
            const {rows} = await db.query('SELECT * FROM employee'); 
            return rows;
        };
    const getEmployeeById = async (id : number) => {
        const {rows} = await db.query(`
            SELECT * FROM employee 
            WHERE id = ?`, [id]);
        return rows[0];
    };
    const createEmployee = async (newEmployee : CreateEmployeeDTO) =>{
        const { insertId } = await db.execute(`
            INSERT INTO employee (name, email, phone, role) 
            VALUES (?, ?, ?, ?)`, 
            [newEmployee.email, newEmployee.name, newEmployee.phone, newEmployee.role]);

        const {rows : insertedRows} = await db.query('SELECT * FROM employee WHERE id = ?', [insertId]);
        return insertedRows[0];
    };
    const updateEmployee = async (id:number, updateData : UpdateEmployeeDTO) => {
        const params : string[] = [];
        const insertQuery : string[] = [];
        Object.entries(updateData).forEach(([key, value]) => {
            if(value === undefined) return; 
            params.push(value);
            insertQuery.push(" " + key + " = ?") 
        })

        const {affectedCount} = await db.execute(`UPDATE employee
            SET ${insertQuery.join(', ')}
            WHERE id = ?`, [params, id]);

        return affectedCount == 0 ? null : await getEmployeeById(id); 
    };
    const deleteEmployee = async (id : number) => {
        const {affectedCount} = await db.execute(`
            DELETE FROM employee 
            WHERE id = ? `, 
            [id]);

        return affectedCount;
    }
    return {
        getAllEmployees,
        getEmployeeById,
        createEmployee,
        updateEmployee,
        deleteEmployee
    };
}

// POr ende, cambie mi manera de laborar y primero definire las funciones y luego las exportare.



// export function makeEmployeeRepo(db : Db) : EmployeeRepo{
//     return {
//         getAllEmployees: async () => {
//             const {rows} = await db.query('SELECT * FROM employee'); 
//             return rows;
//         },
//         getEmployeeById : async (id : number) => {
//             const {rows} = await db.query(`
//                 SELECT * FROM employee 
//                 WHERE id = ?`, [id]);
//             return rows[0];
//         },
//         createEmployee : async (newEmployee : CreateEmployeeDTO) =>{
//             const { rows } = await db.query(`
//                 INSERT INTO employee (name, email, phone, role) 
//                 VALUES (?, ?, ?, ?)`, 
//                 [newEmployee.email, newEmployee.name, newEmployee.phone, newEmployee.role]);

//             const insertId = rows[0].insertId;

//             const {rows : insertedRows} = await db.query('SELECT * FROM employee WHERE id = ?', [insertId]);
//             return insertedRows[0];
//         },
//         updateEmployee : async (id:number, updateData : UpdateEmployeeDTO) => {
//             const params : string[] = [];
//             const insertQuery : string[] = [];
//             Object.entries(updateData).forEach(([key, value]) => {
//                 if(value === undefined) return; // Si el valor es undefined, no lo agregamos a los parametros ni a la query de actualizacion. Esto hace que si el frontend no manda un campo, o lo manda como undefined, no se actualice ese campo en la base de datos. En cambio, si el frontend manda un campo con valor null, se actualizara ese campo a null en la base de datos. Esto es importante para poder diferenciar entre "no quiero actualizar este campo" y "quiero actualizar este campo a null".
//                 params.push(value);
//                 insertQuery.push(" " + key + " = ?") // ESTO OBLIGA A QUE SIEMPRE SE MANEJEN LOS MISMOS NOMBRES DE ATRIBUTOS EN EL OBJETO UpdateEmployeeDTO Y EN LA BASE DE DATOS
//                 // TAMBIEN OBLIGA A LIMPIARLOS SI SON UNDEFINED, O BIEN, QUE SIEMPRE EN EL FRONTEND  NO LOS MANDEN AL BACKEND SI ES QUE NO TIENEN QUE SER EXPLICITAMENTE UNDEFINED. 
//             })

//             const {affectedCount} = await db.execute(`UPDATE employee
//                 SET ${insertQuery.join(', ')}
//                 WHERE id = ?`, [params, id]);

//             return affectedCount == 0 ? null : await this.getEmployeeById(id); // esto no funciona porque no son funciones normales sino flecha. Entonces no tienen su propio this, sino que heredan el this del contexto donde fueron definidas, que en este caso es el objeto que se esta retornando. Entonces no puedo usar this para llamar a las otras funciones del repo, porque no se ha terminado de construir el objeto y el this no tiene esas funciones. En cambio, podria definir una variable antes del return que contenga el resultado de la actualizacion, y luego usar esa variable para decidir si regreso null o llamo a getEmployeeById. O bien, podria hacer una funcion aparte para obtener el empleado por id, y llamarla desde aqui y desde getEmployeeById, pero eso ya es mas complicado y no se si vale la pena. Por ahora lo dejare como esta, pero es algo a tener en cuenta para futuras implementaciones.
//                 // la manera de solucionarlo, es o hacer funciones normales, o definie el objeto repo con las funciones y regresarlas despues ya definidas, para permitir reutilizarlas.
//         }, 
//         deleteEmployee : async (id : number) => {
//             const {affectedCount} = await db.execute(`
//                 DELETE FROM employee 
//                 WHERE id = ? `, 
//                 [id]);

//             return affectedCount;
//         }
//     };
// }


// const { rows } = await db.query(`UPDATE employee
//     SET (
//     WHERE id = ?`, 
//     () => {params.push("d"); return params;});
        // Aqui le estoy pasando la funcion como parametro, no estoy regresando el arreglo
        // En cambio, deberia ejecutar la funcion y que el arreglo se pase como variable de retorno.
        // no puedo poner el params.push directamente porque esta funcion regresa la nueva longitud del arreglo al llamarse.
        // entonces tengo que modificarlo antes y pasarlo solo en la funcion, o hacer una funcion que lo haga en el mismo momento pero se ejecute y retorne el arreglo (mas complicado y no se por que lo haria). pero se ve asi

// const { rows } = await db.query(`UPDATE employee
//     SET (
//     WHERE id = ?`, 
//     (() => {params.push("d"); return params;})());
        // Asi envuelvo la funcion y la ejecuto directamente. Se envuelve para convertirla en una expresion, y los ultimos parentesis son para ejecutar lo que sea que esta dentro de la expresion, sea una, dos, muchas funciones y/o asignaciones.
        //



// Hice esto y me dio el error de que no puedo acceder a UpdateEmployeeDTO con cualquier string. Tengo que explicitamente decir que el string que estoy utilizando es parte de las propiedades del objeto O, hacer que pueda intentar acceder con cualquier string. O bien, iterar directamente por el objeto con entries(), y ahi ya se sabe que estoy accediendo a las llaves correctas
// for(const key in updateData){
//     params.push(updateData[key])
// }   

// type EmployeeKeys = keyof CreateEmployeeDTO;
// const key: EmployeeKeys = "name"; // ahora sí es válido
// console.log(obj[key]); // ✔ correcto

// Object.entries(obj).forEach(([key, value]) => {
//   // aquí key es string, pero puedes forzar:
//   const typedKey = key as keyof CreateEmployeeDTO;
//   console.log(typedKey, value);
// });

//interface CreateEmployeeDTO {
//   [key: string]: any;
//   name: string;
//   email: string;
//   role: string;
// }