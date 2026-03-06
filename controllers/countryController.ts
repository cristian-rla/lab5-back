import type {Request, Response} from 'express';
import {pool} from '../db/db.js';
import type { RowDataPacket } from 'mysql2';

// Obtener todos los países
export const getAllCountries = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM country ORDER BY name');
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener los países:', error);
        res.status(500).json({ error: 'Error al obtener los países' });
    }
};
// Obtener un país por ID
export const getCountryById = async (req: Request, res: Response) => {
    try {
        const [rows, fields] = await pool.query<RowDataPacket[]>('SELECT * FROM country WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'País no encontrado' });
        }
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        console.error('Error al obtener el país:', error);
        res.status(500).json({ error: 'Error al obtener el país' });
    }
};
// Crear un nuevo país
export const createCountry = async (req: Request, res: Response) => {
    const { name, capital, currency } = req.body;
    // Validación básica
    if (!name) {
        return res.status(400).json({ error: 'El nombre del país es obligatorio' });
    }
    try {
        const [rows, fields] = await pool.query<RowDataPacket[]>(
            'INSERT INTO country (name, capital, currency) VALUES ($1, $2, $3) RETURNING *',
            [name, capital, currency]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear el país:', error);
        res.status(500).json({ error: 'Error al crear el país' });
    }
};
// Actualizar un país existente
export const updateCountry = async (req: Request, res: Response) => {
    const { name, capital, currency } = req.body;
    const countryId = req.params.id;
    // Validación básica
    if (!name) {
        return res.status(400).json({ error: 'El nombre del país es obligatorio' });
    }
    try {
        // Verificar si el país existe
        const [checkRows, checkFields] = await pool.query<RowDataPacket[]>('SELECT * FROM country WHERE id = $1', [countryId]);
        if (checkRows.length === 0) {
            return res.status(404).json({ error: 'País no encontrado' });
        }
        // Actualizar el país
        const [updateRows, updateFields] = await pool.query<RowDataPacket[]>(
            'UPDATE country SET name = $1, capital = $2, currency = $3 WHERE id = $4 RETURNING *',
            [name, capital, currency, countryId]
        );
        res.json(updateRows[0]);
    } catch (error) {
        console.error('Error al actualizar el país:', error);
        res.status(500).json({ error: 'Error al actualizar el país' });
    }
};
// Eliminar un país
export const deleteCountry = async (req: Request, res: Response) => {
    const countryId = req.params.id;
    try {
        // Verificar si el país existe
        const [checkRows, checkFields] = await pool.query<RowDataPacket[]>('SELECT * FROM country WHERE id = $1', [countryId]);
        if (checkRows.length === 0) {
            return res.status(404).json({ error: 'País no encontrado' });
        }
        // Eliminar el país
        await pool.query('DELETE FROM country WHERE id = $1', [countryId]);
        res.json({ message: 'País eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el país:', error);
        res.status(500).json({ error: 'Error al eliminar el país' });
    }
};