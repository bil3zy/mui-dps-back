// src/models/selectOptions.model.ts

import { Schema, model, Document } from 'mongoose';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This file defines the Mongoose Schema and Model for 'SelectOptions'.
// This is a key part of the system design to allow non-developers to manage
// the dropdown options for various form fields (e.g., cities, professions).
// The model is a simple key-value store where 'key' is the list identifier
// and 'options' is the array of items to display in a dropdown.
// -----------------------------------------------------------------------------

// =============================================================================
// Interfaces for Mongoose Documents
// =============================================================================

// Interface for a single option object
interface ISelectOptionItem {
    value: string;
    label: string;
}

// Main Interface for the SelectOptions Document
export interface ISelectOptions extends Document {
    key: string;
    label: string;
    options: ISelectOptionItem[];
}

// =============================================================================
// Mongoose Schema Definition
// =============================================================================

const SelectOptionsSchema = new Schema<ISelectOptions>({
    key: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    options: {
        type: [{
            value: { type: String, required: true, trim: true },
            label: { type: String, required: true, trim: true }
        }],
        default: []
    }
}, {
    timestamps: true // Useful for tracking when options were last updated
});

// =============================================================================
// Static Methods
// =============================================================================

// Static method to find a list of options by its unique key
SelectOptionsSchema.statics.findByKey = function (key: string) {
    return this.findOne({ key });
};

// =============================================================================
// Mongoose Model Export
// =============================================================================

export const SelectOptions = model<ISelectOptions>('SelectOptions', SelectOptionsSchema);