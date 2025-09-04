// src/routes/person.routes.ts

import { Router } from 'express';
import {
    createPerson,
    getPersonsPaginated,
    getPersonById,
    updatePerson,
    deletePerson
} from '../controllers/person.controller.ts';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This file defines the API routes for the Person resource.
// It maps specific HTTP methods and URL paths to the corresponding controller functions.
// This is the entry point for all Person-related API requests.
// -----------------------------------------------------------------------------

const personRoutes = Router();

// Define CRUD routes for persons
personRoutes.post('/', createPerson);
personRoutes.get('/', getPersonsPaginated);
personRoutes.get('/:id', getPersonById);
personRoutes.put('/:id', updatePerson);
personRoutes.delete('/:id', deletePerson);

export default personRoutes;