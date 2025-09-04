// src/models/upload.model.ts

import { Schema, model, Document, Types } from 'mongoose';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This file defines the Mongoose Schema and Model for an 'Upload'.
// It's designed to store metadata about uploaded files, decoupling file details
// from the main 'Person' and 'Case' documents. This is a best practice for
// scalability and data management, especially with cloud storage.
// This model includes a reference to the parent document it belongs to.
// -----------------------------------------------------------------------------

// =============================================================================
// Interfaces for Mongoose Documents
// =============================================================================

// Main Interface for the Upload Document
export interface IUpload extends Document {
    fileName: string;
    fileURL: string;
    mimeType: string;
    associatedModel: string; // e.g., 'Person', 'Case'
    associatedId: Types.ObjectId; // ID of the parent document
    uploadDate: Date;
}

// =============================================================================
// Mongoose Schema Definition
// =============================================================================

const UploadSchema = new Schema<IUpload>({
    fileName: { type: String, required: true, trim: true },
    fileURL: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    associatedModel: { type: String, required: true, trim: true, enum: ['Person', 'Case'] }, // Restrict values
    associatedId: { type: Schema.Types.ObjectId, required: true, refPath: 'associatedModel' },
    uploadDate: { type: Date, default: Date.now }
});

// =============================================================================
// Static Methods
// =============================================================================

// Static method to find all uploads for a specific parent document
UploadSchema.statics.findByParent = function (associatedId: string) {
    return this.find({ associatedId });
};

// =============================================================================
// Mongoose Model Export
// =============================================================================

export const Upload = model<IUpload>('Upload', UploadSchema);