// src/services/person.service.ts

import { IPerson, Person } from "../models/person.model.ts";

export const createPerson = async (personData: Partial<IPerson>): Promise<IPerson> => {
  const person = new Person(personData);
  return person.save();
};

export const getPersonById = async (id: string): Promise<IPerson | null> => {
  return Person.findById(id)
    .populate("nationalityId", "name")
    .populate("maritalStatusId", "status")
    .populate("spouseJobId", "title")
    .populate("occupationId", "title")
    .populate("workplaceCityId", "name")
    .populate("currentAddressCityId", "name")
    .populate("originAddressCityId", "name")
    .populate("birthPlaceCityId", "name")
    .populate("classificationId", "name")
    .populate("residenceTypeId", "type")
    .populate("idCard.issuePlaceCityId", "name")
    .populate("passport.issuePlaceCityId", "name")
    .populate("otherDocuments.typeId", "name")
    .populate("statusId", "status")
    .exec();
};

export const getAllPersons = async (): Promise<IPerson[]> => {
  return Person.find()
    .populate("nationalityId", "name")
    .populate("maritalStatusId", "status")
    .populate("spouseJobId", "title")
    .populate("occupationId", "title")
    .populate("workplaceCityId", "name")
    .populate("currentAddressCityId", "name")
    .populate("originAddressCityId", "name")
    .populate("birthPlaceCityId", "name")
    .populate("classificationId", "name")
    .populate("residenceTypeId", "type")
    .populate("idCard.issuePlaceCityId", "name")
    .populate("passport.issuePlaceCityId", "name")
    .populate("otherDocuments.typeId", "name")
    .populate("statusId", "status")
    .exec();
};

export const updatePerson = async (id: string, updateData: Partial<IPerson>): Promise<IPerson | null> => {
  return Person.findByIdAndUpdate(id, updateData, { new: true });
};

export const deletePerson = async (id: string): Promise<IPerson | null> => {
  return Person.findByIdAndDelete(id);
};
