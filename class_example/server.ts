import express from 'express';
import type {Request, Response} from 'express';
import cors from 'cors';
import countryRoutes from './routes/countryRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Rutas
app.use('/api/countries', countryRoutes);
// Ruta de inicio
app.get('/', (req: Request, res: Response) => {
    res.send('API de Países funcionando correctamente con PostgreSQL');
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});