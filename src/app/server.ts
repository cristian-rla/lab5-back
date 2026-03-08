import express from 'express';
import type {Request, Response} from 'express';
import cors from 'cors';
import { buildContainer } from './container.js';
import { config } from '../config/env.js';

const app = express();

const { countryRouter, employeeRouter } = buildContainer();
// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/countries', countryRouter.router);
app.use('/api/employees', employeeRouter.router);

// Ruta de inicio
app.get('/', (req: Request, res: Response) => {
    res.send('API de Países funcionando correctamente con PostgreSQL');
});

// Iniciar servidor
app.listen(config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
});