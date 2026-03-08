import express from 'express';
import { deleteCountry, updateCountry, createCountry, getCountryById, getAllCountries } from '../controllers/countryController.js';

const router = express.Router();
// Rutas para los países
router.get('/', getAllCountries);
router.get('/:id', getCountryById);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);

export default router;    