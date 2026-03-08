import { createDb } from "../infra/db/db.js";

import { makeCountryRepo } from "../modules/country/country.repo.js";
import { makeCountryService } from "../modules/country/country.service.js";
import { makeCountryController } from "../modules/country/country.controller.js";
import { makeCountryRouter } from "../modules/country/country.routes.js";

import { makeEmployeeRepo } from "../modules/employee/employee.repo.js";
import { makeEmployeeService } from "../modules/employee/employee.service.js";
import { makeEmployeeController } from "../modules/employee/employee.controller.js";
import { makeEmployeeRouter } from "../modules/employee/employee.routes.js";

export function buildContainer(){
    const db = createDb();
    db.testConnection();

    const countryRepo = makeCountryRepo(db);
    const countryService = makeCountryService(countryRepo);
    const countryController = makeCountryController(countryService);
    const countryRouter = makeCountryRouter(countryController);

    const employeeRepo = makeEmployeeRepo(db);
    const employeeService = makeEmployeeService(employeeRepo);
    const employeeController = makeEmployeeController(employeeService);
    const employeeRouter = makeEmployeeRouter(employeeController);

    return { countryRouter , employeeRouter };
};

