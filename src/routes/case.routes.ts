import { Router } from 'express';
import {
  createCase,
  getCasesPaginated,
  getCaseById,
  updateCase,
  deleteCase
} from '../controllers/case.controller.ts';

const caseRoutes = Router();

// Create a new case
caseRoutes.post('/', createCase);

// Get paginated list of cases
caseRoutes.get('/', getCasesPaginated);

// Get a single case by ID
caseRoutes.get('/:id', getCaseById);

// Update a case by ID
caseRoutes.put('/:id', updateCase);

// Delete a case by ID
caseRoutes.delete('/:id', deleteCase);

export default caseRoutes;
