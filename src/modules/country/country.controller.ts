import type { Request, Response } from 'express';
import type { CountryService } from './country.service.js';

import { z } from 'zod';

export type CountryController = {
    getAllCountries: (req: Request, res: Response) => void;
    getCountryById: (req: Request, res: Response) => void;
    createCountry: (req: Request, res: Response) => void;
    updateCountry: (req: Request, res: Response) => void;
    deleteCountry: (req: Request, res: Response) => void;
};

const createCountrySchema = z.object({
    name: z.string(),
    capital: z.string().optional(), // esto es para que si no viene el campo, sea undefined, pero si viene, debe ser string. Porque con zod, si es opcional, entonces puede ser string o undefined, pero si no viene, entonces es undefined. Entonces, con esta transformacion, hago que si no viene, sea undefined, pero si viene, debe ser string.
    currency: z.string().optional() // lo mismo que el capital, pero para la moneda.
})

export function makeCountryController(countryService: CountryService) : CountryController {
    return {
        getAllCountries: async (req: Request, res: Response) => {
            const countries = await countryService.getAllCountries();
            res.send(countries);
        },
        getCountryById: async (req: Request, res: Response) => {
            if(req.params.id === undefined || typeof req.params.id !== "string"){ // hay una configuracion en la que pueden tener atributos repetidos ParsedQs. por eso, tengo que checar que son string y no string[].
                res.status(400).send('Invalid id ')
                return;
            }
            const country = await countryService.getCountryById(parseInt(req.params.id));
            res.send(country);
        },
        createCountry: async (req: Request, res: Response) => {
            const parsed = createCountrySchema.parse(req.body);
            if (!parsed) {
                res.status(400).send('Invalid country data');
                return;
            }

            const country = await countryService.createCountry(parsed); // este me daba error, porque Argument of type '{ name: string; capital?: string | undefined; currency?: string | undefined; }' is not assignable to parameter of type 'CreateCountryDTO' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
            // eso significa que el ? significa que puede que capital no exista, pero si si existe, DEBE ser el tipo especificado. 
            // entonces, si estan deben ser string, pero NO undefined. Yo creo que el problema es que en el tipo CreateCountryDTO, el capital y currency son opcionales, pero no pueden ser undefined. Entonces, al hacer el parse, zod me dice que si no estan, entonces son undefined, y eso no es compatible con el tipo CreateCountryDTO. Para solucionarlo, puedo hacer que en el tipo CreateCountryDTO, el capital y currency sean string | undefined, para que sean compatibles con lo que zod me devuelve.
            // eso hace el optional de zod, que si viene, puede ser undefined o el tipo seleccionado, pero si no viene, entonces no las agrega.
    
            res.send(country);
        },
        updateCountry : async (req : Request, res: Response) => {
            if(req.params.id === undefined || typeof req.params.id !== "string"){
                res.status(400).send('Invalid id ')
                return;
            }
            
            const country = await countryService.updateCountry(parseInt(req.params.id), req.body);
            res.send(country);
        },
        deleteCountry : async (req : Request, res: Response) => {
            if(req.params.id === undefined || typeof req.params.id !== "string"){
                res.status(400).send('Invalid id ')
                return;
            }
            const country = await countryService.deleteCountry(parseInt(req.params.id));
            res.send(country);
        }
    };
};