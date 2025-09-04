import type { Request, Response } from 'express';
import { Case } from '../models/case.model.ts';
import { Types } from 'mongoose';

// Create a new case
export const createCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: 'Error creating case', error });
  }
};

// Get paginated list of cases
export const getCasesPaginated = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const cases = await Case.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('associatedPerson');
    const total = await Case.countDocuments();
    res.status(200).json({
      docs: cases,
      totalDocs: total,
      limit,
      totalPages: Math.ceil(total / limit),
      page,
      hasPrevPage: page > 1,
      hasNextPage: page * limit < total,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page * limit < total ? page + 1 : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cases', error });
  }
};

// Get a single case by ID
export const getCaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const singleCase = await Case.findById(req.params.id).populate('associatedPerson');
    if (!singleCase) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    res.status(200).json(singleCase);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving case', error });
  }
};

// Update a case by ID
export const updateCase = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('associatedPerson');
    if (!updatedCase) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating case', error });
  }
};

// Delete a case by ID
export const deleteCase = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting case', error });
  }
};
