// Aqui va toda la logica de negocio !! Por ahora no hay NADA. Tan solo es llamar una funcion de otra capa. Pero por ejemplo, aqui checaria reglas antes de insertar, o cambiar los valores de las columnas dependiendo de los valores que me pasan como parametros, etc etc. hasheo, longitud de contraseñas, etc.
import type { CountryRepo } from "./country.repo.js";
import type { Country, CreateCountryDTO } from "./country.types.js";

export type CountryService = {
    getAllCountries: () => Promise<Country[]>;
    getCountryById: (id: number) => Promise<Country | null>;
    createCountry: (countryData: CreateCountryDTO) => Promise<Country>;
    updateCountry: (id: number, countryData: CreateCountryDTO) => Promise<Country | null>;
    deleteCountry: (id: number) => Promise<void>;
};

export function makeCountryService(countryRepository: CountryRepo) : CountryService {
    return {
        getAllCountries: async () => {
            return await countryRepository.getAll();
        },
        getCountryById : async (id :number) => {
            return await countryRepository.getById(id);
        },
        createCountry : async (countryData : CreateCountryDTO) => {
            return await countryRepository.create(countryData);
        },
        updateCountry : async (id: number, countryData: CreateCountryDTO) => {
            return await countryRepository.update(id, countryData);
        }, 
        deleteCountry : async (id : number) => {
            await countryRepository.delete(id);
        }
    };
}