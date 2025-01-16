export interface Message {
  id: number;
  patientId: number;
  content: string;
  sender: string;
  timestamp: string;
}

export interface Patient {
  id: number;
  name: string;
  status: string;
  dateOfBirth: string;
  referralDate: string;
  insuranceProvider?: string;
  contactNumber?: string;
}

export interface DetailedPatient extends Patient {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  referringPractice?: ReferringPractice;
  referringPhysician?: ReferringPhysician;
  officeContact?: PracticeContact;
  primaryInsurance: {
    name: string;
    groupId: string;
    memberId: string;
  };
  secondaryInsurance?: {
    name: string;
    groupId: string;
    memberId: string;
  };
  wounds: Wound[];
  preferredProvider?: string;
}

export interface PatientsByStatus {
  [key: string]: Patient[];
}

export interface ReferringPractice {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export interface ReferringPhysician {
  id: number;
  practiceId: number;
  name: string;
  specialty: string;
  email: string;
  phoneNumber: string;
}

export interface PracticeContact {
  id: number;
  practiceId: number;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
}

export interface Wound {
  location: string;
  length: number;
  width: number;
  depth: number;
  age: number;
  ageUnit: 'days' | 'weeks' | 'months' | 'years';
  description: string;
  images?: File[];
}