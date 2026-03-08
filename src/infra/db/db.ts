import mysql from 'mysql2/promise';
import { config } from '../../config/env.js';

// se deja muy general para que pueda ser adaptado a otras bases de datos si es necesario
export type Db = {
    query : (text: string, params?: any[]) => Promise< {rows : any[]}>;
    close : () => Promise<void>;
    testConnection : () => Promise<void>;
};

export function createDb(): Db {
    const pool = mysql.createPool({
        host: config.db_host,
        user: config.db_user,
        password: config.db_password,
        database: config.db_name,
        port: config.db_port,
        connectionLimit: config.db_connection_limit
    });

    return {
        query: async (text: string, params?: any[]) => {
            const [rows] = await pool.query(text, params);
            return { rows: rows as any[] };
        },
        close: async () => {
            await pool.end();
        },
        testConnection: async () => {
            try {
                const connection = await pool.getConnection();
                console.log('Conexión a MySQL establecida con éxito');
            } catch (error) {
                console.error('Error al conectar a MySQL:', error);
            }
        }

    };
}