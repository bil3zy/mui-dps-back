// src/models/case.model.ts

import { Schema, model, Document, Types } from 'mongoose';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This file defines the Mongoose Schema and Model for a 'Case' document.
// It is designed to link to a 'Person' document via an ObjectId reference.
// The model includes static methods for finding cases, particularly by the associated person's ID.
// This is the foundation for managing all case-related information.
// -----------------------------------------------------------------------------

// =============================================================================
// Interfaces for Mongoose Documents
// =============================================================================

// Interface for the sub-document 'caseInfo'
interface ICaseInfo {
    caseNumber: string;
    caseYear: number;
    accusation: string;
    criminalRecordNumber: string;
    judicialDisposition: string;
}

// Interface for the sub-document 'arrestInfo'
interface IArrestInfo {
    arrestDate: Date;
    arrestLocation: string;
    arrestingAuthority: {
        mainAuthority: string;
        branch: string;
    };
}

// Interface for the sub-document 'seizedItems'
interface ISeizedItems {
    itemName: string;
    itemType: string;
    quantity: number;
    quantityUnit: string;
    seizedAmount?: number;
    reportingOffice?: string;
    depositLocation?: string;
}

// Main Interface for the Case Document, extending Mongoose's Document
export interface ICase extends Document {
    caseInfo: ICaseInfo;
    arrestInfo: IArrestInfo;
    seizedItems: ISeizedItems;
    associatedPerson: Types.ObjectId; // Reference to the Person model
    createdAt: Date;
    updatedAt: Date;
}

// =============================================================================
// Mongoose Schema Definition
// =============================================================================

const CaseSchema = new Schema<ICase>({
    caseInfo: {
        caseNumber: { type: String, required: true, unique: true, trim: true },
        caseYear: { type: Number, required: true },
        accusation: { type: String, required: true, trim: true },
        criminalRecordNumber: { type: String, required: true, trim: true },
        judicialDisposition: { type: String, required: true, trim: true }
    },
    arrestInfo: {
        arrestDate: { type: Date, required: true },
        arrestLocation: { type: String, required: true, trim: true },
        arrestingAuthority: {
            mainAuthority: { type: String, required: true, trim: true },
            branch: { type: String, required: true, trim: true }
        }
    },
    seizedItems: {
        itemName: { type: String, required: true, trim: true },
        itemType: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true },
        quantityUnit: { type: String, required: true, trim: true },
        seizedAmount: { type: Number },
        reportingOffice: { type: String, trim: true },
        depositLocation: { type: String, trim: true }
    },
    associatedPerson: {
        type: Schema.Types.ObjectId,
        ref: 'Person', // Mongoose reference to the Person model
        required: true
    }
}, {
    timestamps: true
});

// =============================================================================
// Static Methods
// =============================================================================

// Static method to find all cases associated with a given person ID
CaseSchema.statics.findByPersonId = function (personId: string) {
    return this.find({ associatedPerson: personId }).populate('associatedPerson');
};

// =============================================================================
// Mongoose Model Export
// =============================================================================

export const Case = model<ICase>('Case', CaseSchema);