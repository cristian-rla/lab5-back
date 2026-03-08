import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
    
dotenv.config();
// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'bdpaises',
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 10, // máximo número de clientes en el pool
});
// Función para verificar la conexión
async function testConnection() {
    try {
        const client = await pool.getConnection();
        console.log('Conexión a MySQL establecida con éxito');
    } catch (error) {
        console.error('Error al conectar a MySQL:', error);
    }
}
testConnection();
export { pool };