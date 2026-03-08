// Acceso a datos.
import type { Country, CreateCountryDTO } from "./country.types.js";
import type { Db } from "../../infra/db/db.js";

export type CountryRepo = {
    getAll: () => Promise<Country[]>;
    getById: (id: number) => Promise<Country | null>;
    create: (data: CreateCountryDTO) => Promise<Country>;
    update: (id: number, data: Partial<CreateCountryDTO>) => Promise<Country | null>;
    delete: (id: number) => Promise<void>;
};

export function makeCountryRepo(db: Db) : CountryRepo {

    return {
        getAll: async () => {
            const { rows } = await db.query('SELECT * FROM country');
            return rows as Country[];
        },
        getById: async (id: number) => {
            const { rows } = await db.query(`
                SELECT * FROM country 
                WHERE id = ?
                `, [id]);
            return rows[0] as Country;
        },
        create : async(data: CreateCountryDTO) => {
            const { rows } = await db.query(`
                INSERT INTO country (name, capital, currency) VALUES (?, ?, ?)
                `, [data.name, data.capital, data.currency]);
            const insertId = rows[0].insertId;
            const { rows : insertedRow } = await db.query(`
                SELECT * FROM country 
                WHERE id = ?
                `, [insertId]);
            return insertedRow[0] as Country;
        },
        update : async(id: number, data: Partial<CreateCountryDTO>) => {
            const fields = [];
            const values = [];
            if (data.name) {
                fields.push('name = ?');
                values.push(data.name);
            }
            if (data.capital) {
                fields.push('capital = ?');
                values.push(data.capital);
            }
            if (data.currency) {
                fields.push('currency = ?');
                values.push(data.currency);
            }
            if (fields.length === 0) {
                return null;
            }

            values.push(id);
            const { rows } = await db.query(`
                UPDATE country 
                SET ${fields.join(', ')} 
                WHERE id = ?
            `, values);
            // Al parecer no da rows[0] insertId al editar jaja const insertId = rows[0].insertId;

            const { rows : insertedRow } = await db.query(`
                SELECT * FROM country 
                WHERE id = ?
                `, [id]);
            return insertedRow[0] as Country;

        },
        delete : async(id: number) => {
            await db.query(`
                DELETE FROM country 
                WHERE id = ?
            `, [id]);
        }
    };
}