import { Router } from "express";
import type { CountryController } from "./country.controller.js";

export type CountryRouter = {
    router: Router;
};

export function makeCountryRouter(countryController: CountryController) : CountryRouter {
    const router = Router();
    router.get('/', countryController.getAllCountries);
    router.get('/:id', countryController.getCountryById);
    router.post('/', countryController.createCountry);
    router.put('/:id', countryController.updateCountry);
    router.delete('/:id', countryController.deleteCountry);
    return { router };
}

