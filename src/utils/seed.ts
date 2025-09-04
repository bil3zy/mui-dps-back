import mongoose from 'mongoose';
import { Person,  } from '../models/person.model.ts';
import type { IPerson } from '../models/person.model.ts';
import { Case,  } from '../models/case.model.ts';
import type { ICase } from '../models/case.model.ts';   

// ---------------------------
// MongoDB connection
// ---------------------------
const MONGODB_URI = 'mongodb://127.0.0.1:27017/mui-dps';

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
}

// ---------------------------
// Arabic seed data arrays
// ---------------------------
const arabicFirstNames = ['أحمد', 'محمد', 'علي', 'خالد', 'سلمان', 'فاطمة', 'عائشة', 'نور', 'هند', 'ياسين'];
const arabicFatherNames = ['محمد', 'علي', 'حسن', 'سعيد', 'فهد', 'يوسف', 'سالم', 'مروان'];
const arabicGrandfatherNames = ['حسن', 'عبدالله', 'سعيد', 'فوزي', 'محمود', 'عبد الرحمن'];
const arabicFamilyNames = ['الفهيد', 'الحسني', 'الزيدي', 'العقابي', 'الشامي', 'الباهري'];
const arabicCities = ['طرابلس', 'بنغازي', 'سبها', 'مصراتة', 'الخمس'];
const professions = ['مهندس', 'طبيب', 'معلم', 'محاسب', 'مدير', 'محامي', 'مطور برامج', 'صيدلي'];
const accusations = ['سرقة', 'احتيال', 'تزوير', 'عنف', 'تعدي على الممتلكات', 'تهديد'];
const judicialDispositions = ['تحت التحقيق', 'مغلق', 'محكمة أول درجة', 'محكمة استئناف', 'في انتظار الحكم'];

// ---------------------------
// Helper functions
// ---------------------------
function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ---------------------------
// Seed Persons
// ---------------------------
async function seedPersons() {
  const persons: IPerson[] = [];

  for (let i = 0; i < 50; i++) {
    const person = new Person({
      personalInfo: {
        firstName: randomFromArray(arabicFirstNames),
        fatherName: randomFromArray(arabicFatherNames),
        grandfatherName: randomFromArray(arabicGrandfatherNames),
        familyName: randomFromArray(arabicFamilyNames),
        nationalId: (1000000000 + i).toString(),
        nationality: 'ليبي',
        gender: Math.random() > 0.5 ? 'ذكر' : 'أنثى',
        dateOfBirth: randomDate(new Date(1960, 0, 1), new Date(2000, 11, 31)),
        placeOfBirth: randomFromArray(arabicCities),
        maritalStatus: Math.random() > 0.5 ? 'متزوج' : 'أعزب'
      },
      contactInfo: {
        mobilePhone: `09${Math.floor(1000000 + Math.random() * 8999999)}`,
        currentAddress: {
          city: randomFromArray(arabicCities),
          street: `شارع ${randomFromArray(arabicFirstNames)}`,
          details: `شقة ${Math.floor(1 + Math.random() * 100)}`
        }
      },
      professionalInfo: {
        profession: randomFromArray(professions),
        academicQualification: Math.random() > 0.5 ? 'بكالوريوس' : 'ماجستير',
        fatherProfession: randomFromArray(professions),
        motherProfession: randomFromArray(professions)
      },
      identificationDocuments: {
        nationalIdDetails: {
          issuingLocation: randomFromArray(arabicCities),
          issueDate: randomDate(new Date(2000, 0, 1), new Date(2020, 11, 31))
        }
      },
      uploads: {
        personalPhoto: 'http://example.com/photo.jpg',
        fingerprint: 'http://example.com/fingerprint.png',
        otherDocuments: []
      }
    });
    persons.push(person);
  }

  const savedPersons = await Person.insertMany(persons);
  console.log('50 Persons created');
  return savedPersons;
}

// ---------------------------
// Seed Cases
// ---------------------------
async function seedCases(persons: IPerson[]) {
  const cases: ICase[] = [];

  for (let i = 0; i < 50; i++) {
    const associatedPerson = randomFromArray(persons);
    const c = new Case({
      caseInfo: {
        caseNumber: `C${1000 + i}`,
        caseYear: 2025,
        accusation: randomFromArray(accusations),
        criminalRecordNumber: `CR${1000 + i}`,
        judicialDisposition: randomFromArray(judicialDispositions)
      },
      arrestInfo: {
        arrestDate: randomDate(new Date(2020, 0, 1), new Date()),
        arrestLocation: randomFromArray(arabicCities),
        arrestingAuthority: {
          mainAuthority: 'وزارة الداخلية',
          branch: randomFromArray(arabicCities)
        }
      },
      seizedItems: {
        itemName: randomFromArray(['هاتف', 'حاسوب محمول', 'مجوهرات', 'نقد']),
        itemType: randomFromArray(['إلكتروني', 'نقدي', 'معدن ثمين']),
        quantity: Math.floor(1 + Math.random() * 5),
        quantityUnit: 'قطعة'
      },
      associatedPerson: associatedPerson._id
    });
    cases.push(c);
  }

  await Case.insertMany(cases);
  console.log('50 Cases created');
}

// ---------------------------
// Run seed
// ---------------------------
async function runSeed() {
  try {
    await connectDB();
    const persons = await seedPersons();
    await seedCases(persons);
    console.log('Seeding completed');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

runSeed();
