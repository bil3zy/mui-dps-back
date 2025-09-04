import  mongoosePaginate  from 'mongoose-paginate-v2';
// src/models/person.model.ts

import mongoose from 'mongoose';
const { Schema, model, Document } = mongoose;
import type { PaginateModel } from 'mongoose';

// -----------------------------------------------------------------------------
// AI-Friendly Context for this file:
// This file defines the Mongoose Schema and Model for a 'Person' document.
// The code has been corrected to properly handle the TypeScript error TS2351.
// The `IPerson` interface extends `Document` for instance properties.
// The `IPersonModel` interface extends `PaginateModel<IPerson>` to add
// the static methods from `mongoose-paginate-v2` and custom static methods.
// The `model` function is now correctly typed to return a constructable model.
// This ensures type safety for both document instances and model static methods.
// -----------------------------------------------------------------------------

// =============================================================================
// Interfaces for Mongoose Documents
// =============================================================================

// Interface for the sub-document 'personalInfo'
interface IPersonalInfo {
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    familyName: string;
    nationalId: string;
    nationality: string;
    gender: 'ذكر' | 'أنثى';
    dateOfBirth: Date;
    placeOfBirth: string;
    maritalStatus: string;
    spouseName?: string;
    numberOfSons?: number;
}

// Interface for the sub-document 'contactInfo'
interface IContactInfo {
    mobilePhone: string;
    currentAddress: {
        city: string;
        street: string;
        details: string;
    };
    workAddress?: {
        city: string;
        details: string;
    };
}

// Interface for the sub-document 'professionalInfo'
interface IProfessionalInfo {
    profession: string;
    academicQualification: string;
    fatherProfession: string;
    motherProfession: string;
}

// Interface for the sub-document 'identificationDocuments'
interface IIdentificationDocuments {
    nationalIdDetails: {
        issuingLocation: string;
        issueDate: Date;
    };
    passportDetails?: {
        passportNumber: string;
        issuingLocation: string;
        issueDate: Date;
    };
}

// Interface for the sub-document 'uploads'
interface IUploads {
    personalPhoto: string;
    fingerprint: string;
    otherDocuments: string[];
}

// Main Interface for the Person Document, extending Mongoose's Document
// This describes the properties of a single document instance.
export interface IPerson extends Document {
    personalInfo: IPersonalInfo;
    contactInfo: IContactInfo;
    professionalInfo: IProfessionalInfo;
    identificationDocuments: IIdentificationDocuments;
    uploads: IUploads;
    createdAt: Date;
    updatedAt: Date;
}

// =============================================================================
// Mongoose Schema Definition
// =============================================================================

const PersonSchema = new Schema<IPerson>({
    personalInfo: {
        firstName: { type: String, required: true, trim: true },
        fatherName: { type: String, required: true, trim: true },
        grandfatherName: { type: String, required: true, trim: true },
        familyName: { type: String, required: true, trim: true },
        nationalId: { type: String, required: true, unique: true, trim: true },
        nationality: { type: String, required: true, trim: true },
        gender: { type: String, required: true, enum: ['ذكر', 'أنثى'] },
        dateOfBirth: { type: Date, required: true },
        placeOfBirth: { type: String, required: true, trim: true },
        maritalStatus: { type: String, required: true, trim: true },
        spouseName: { type: String, trim: true },
        numberOfSons: { type: Number },
    },
    contactInfo: {
        mobilePhone: { type: String, required: true, trim: true },
        currentAddress: {
            city: { type: String, required: true, trim: true },
            street: { type: String, required: true, trim: true },
            details: { type: String, required: true, trim: true },
        },
        workAddress: {
            city: { type: String, trim: true },
            details: { type: String, trim: true },
        },
    },
    professionalInfo: {
        profession: { type: String, required: true, trim: true },
        academicQualification: { type: String, required: true, trim: true },
        fatherProfession: { type: String, required: true, trim: true },
        motherProfession: { type: String, required: true, trim: true },
    },
    identificationDocuments: {
        nationalIdDetails: {
            issuingLocation: { type: String, required: true, trim: true },
            issueDate: { type: Date, required: true },
        },
        passportDetails: {
            passportNumber: { type: String, trim: true },
            issuingLocation: { type: String, trim: true },
            issueDate: { type: Date },
        },
    },
    uploads: {
        personalPhoto: { type: String, required: true },
        fingerprint: { type: String, required: true },
        otherDocuments: { type: [String], default: [] },
    },
}, {
    timestamps: true
});

// =============================================================================
// Static Methods & Plugins
// =============================================================================

// Add the pagination plugin to the schema
PersonSchema.plugin(mongoosePaginate);

// Extend the PaginateModel to add our custom static methods
// This is the key change to correctly type the model
export interface IPersonModel extends PaginateModel<IPerson> {
    findByNationalId(nationalId: string): Promise<IPerson | null>;
    searchByName(name: string): Promise<IPerson[]>;
}

// Add a static method to find a person by their national ID
PersonSchema.statics.findByNationalId = function (nationalId: string) {
    return this.findOne({ 'personalInfo.nationalId': nationalId });
};

// Add a static method to search for a person by name
PersonSchema.statics.searchByName = function (name: string) {
    const searchRegex = new RegExp(name, 'i');
    return this.find({
        $or: [
            { 'personalInfo.firstName': { $regex: searchRegex } },
            { 'personalInfo.fatherName': { $regex: searchRegex } },
            { 'personalInfo.familyName': { $regex: searchRegex } }
        ]
    });
};

// =============================================================================
// Mongoose Model Export
// =============================================================================

// Export the Mongoose model, now correctly typed
export const Person = model<IPerson, IPersonModel>('Person', PersonSchema);