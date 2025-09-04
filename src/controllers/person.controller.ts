// src/controllers/person.controller.ts

import { Types } from 'mongoose';
import { Person } from '../models/person.model.ts';
import type { Request, Response } from 'express';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This controller handles all API logic for the Person model.
// It contains functions for creating, retrieving, updating, and deleting person records.
// It also includes a robust `getPersonsPaginated` function that leverages the
// Mongoose pagination plugin.
// Error handling is included to provide meaningful responses to the client.
// -----------------------------------------------------------------------------

// =============================================================================
// Controller Functions
// =============================================================================

/**
 * @route POST /api/persons
 * @description Creates a new person record in the database.
 * @access Public (or protected by middleware)
 */
export const createPerson = async (req: Request, res: Response): Promise<void> => {
    try {
        const newPerson = new Person(req.body);
        const savedPerson = await newPerson.save();
        res.status(201).json(savedPerson);
    } catch (error) {
        // AI Note: In a real-world app, you might add more specific error handling,
        // e.g., for duplicate national IDs.
        res.status(400).json({ message: 'Error creating person', error });
    }
};

/**
 * @route GET /api/persons?page=1&limit=10
 * @description Retrieves a paginated list of all person records.
 * @access Public
 */
export const getPersonsPaginated = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await Person.paginate({}, { page, limit });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving persons', error });
    }
};

/**
 * @route GET /api/persons/:id
 * @description Retrieves a single person record by their ID.
 * @access Public
 */
export const getPersonById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const person = await Person.findById(req.params.id);
        if (!person) {
            res.status(404).json({ message: 'Person not found' });
            return;
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving person', error });
    }
};

/**
 * @route PUT /api/persons/:id
 * @description Updates an existing person record.
 * @access Public (or protected)
 */
export const updatePerson = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPerson) {
            res.status(404).json({ message: 'Person not found' });
            return;
        }
        res.status(200).json(updatedPerson);
    } catch (error) {
        res.status(500).json({ message: 'Error updating person', error });
    }
};

/**
 * @route DELETE /api/persons/:id
 * @description Deletes a person record from the database.
 * @access Protected
 */
export const deletePerson = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const deletedPerson = await Person.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            res.status(404).json({ message: 'Person not found' });
            return;
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting person', error });
    }
};