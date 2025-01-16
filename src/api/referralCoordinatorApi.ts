import { Patient, Message, ReferringPractice, ReferringPhysician, PracticeContact } from '../types/referral';

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Sarah Wilson",
    status: "New",
    dateOfBirth: "1990-05-15",
    referralDate: "2024-03-15",
    insuranceProvider: "Blue Cross",
    contactNumber: "(555) 123-4567"
  },
  {
    id: 2,
    name: "John Davis",
    status: "Acknowledge Receipt",
    dateOfBirth: "1985-08-22",
    referralDate: "2024-03-14",
    insuranceProvider: "Aetna",
    contactNumber: "(555) 234-5678"
  },
  {
    id: 3,
    name: "Emma Thompson",
    status: "Verified Insurance",
    dateOfBirth: "1992-03-10",
    referralDate: "2024-03-13",
    insuranceProvider: "UnitedHealth",
    contactNumber: "(555) 345-6789"
  },
  {
    id: 4,
    name: "Michael Brown",
    status: "Information Needed",
    dateOfBirth: "1988-11-28",
    referralDate: "2024-03-12",
    insuranceProvider: "Cigna",
    contactNumber: "(555) 456-7890"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    status: "Needs to Be Assigned",
    dateOfBirth: "1995-07-03",
    referralDate: "2024-03-11",
    insuranceProvider: "Humana",
    contactNumber: "(555) 567-8901"
  }
];

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: 1,
    patientId: 1,
    content: "Initial referral received from Dr. Smith",
    sender: "System",
    timestamp: "2024-03-15T09:00:00Z"
  },
  {
    id: 2,
    patientId: 1,
    content: "Insurance verification initiated",
    sender: "Jane (Coordinator)",
    timestamp: "2024-03-15T09:30:00Z"
  },
  {
    id: 3,
    patientId: 1,
    content: "Waiting for additional documentation from PCP",
    sender: "Jane (Coordinator)",
    timestamp: "2024-03-15T10:15:00Z"
  },
  {
    id: 4,
    patientId: 2,
    content: "Patient contacted for initial screening",
    sender: "Mark (Coordinator)",
    timestamp: "2024-03-14T14:20:00Z"
  }
];

// Mock data for practices
const mockPractices: ReferringPractice[] = [
  {
    id: 1,
    name: "City Medical Group",
    address: "123 Medical Plaza, Suite 100",
    phoneNumber: "(555) 111-2233",
    email: "referrals@citymedical.com"
  },
  {
    id: 2,
    name: "Valley Healthcare Center",
    address: "456 Valley Road",
    phoneNumber: "(555) 444-5566",
    email: "referrals@valleyhealth.com"
  }
];

// Mock data for physicians
const mockPhysicians: ReferringPhysician[] = [
  {
    id: 1,
    practiceId: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    email: "sjohnson@citymedical.com",
    phoneNumber: "(555) 111-2234"
  },
  {
    id: 2,
    practiceId: 1,
    name: "Dr. Michael Chen",
    specialty: "Family Medicine",
    email: "mchen@citymedical.com",
    phoneNumber: "(555) 111-2235"
  },
  {
    id: 3,
    practiceId: 2,
    name: "Dr. Emily Rodriguez",
    specialty: "Internal Medicine",
    email: "erodriguez@valleyhealth.com",
    phoneNumber: "(555) 444-5567"
  }
];

// Mock data for contacts
const mockContacts: PracticeContact[] = [
  {
    id: 1,
    practiceId: 1,
    name: "Jane Smith",
    role: "Referral Coordinator",
    email: "jsmith@citymedical.com",
    phoneNumber: "(555) 111-2236"
  },
  {
    id: 2,
    practiceId: 2,
    name: "Robert Wilson",
    role: "Office Manager",
    email: "rwilson@valleyhealth.com",
    phoneNumber: "(555) 444-5568"
  }
];

let patientIdCounter = mockPatients.length + 1;
let messageIdCounter = mockMessages.length + 1;
let practiceIdCounter = mockPractices.length + 1;
let physicianIdCounter = mockPhysicians.length + 1;

// API Functions
export const fetchPatients = async (): Promise<Patient[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPatients;
};

export const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newPatient: Patient = {
    ...patientData,
    id: patientIdCounter++
  };
  mockPatients.push(newPatient);
  
  addMessage(newPatient.id, `New patient referral created`, "System");
  
  return newPatient;
};

export const updatePatientStatus = async (patientId: number, status: string): Promise<Patient> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const patient = mockPatients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }
  patient.status = status;
  return patient;
};

export const calculateDistanceMatrix = async (patientId: number): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ['Dr. Smith (2.3 miles)', 'Dr. Johnson (3.1 miles)', 'Dr. Williams (4.5 miles)'];
};

export const fetchMessages = async (patientId: number): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMessages.filter(m => m.patientId === patientId);
};

export const addMessage = async (patientId: number, content: string, sender: string): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newMessage: Message = {
    id: messageIdCounter++,
    patientId,
    content,
    sender,
    timestamp: new Date().toISOString()
  };
  mockMessages.push(newMessage);
  return newMessage;
};

export const fetchReferringPractices = async (): Promise<ReferringPractice[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPractices;
};

export const searchPractices = async (query: string): Promise<ReferringPractice[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const lowercaseQuery = query.toLowerCase();
  return mockPractices.filter(practice => 
    practice.name.toLowerCase().includes(lowercaseQuery) ||
    practice.address.toLowerCase().includes(lowercaseQuery)
  );
};

export const addReferringPractice = async (practice: Omit<ReferringPractice, 'id'>): Promise<ReferringPractice> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newPractice: ReferringPractice = {
    ...practice,
    id: practiceIdCounter++
  };
  mockPractices.push(newPractice);
  return newPractice;
};

export const fetchPhysiciansByPractice = async (practiceId: number): Promise<ReferringPhysician[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPhysicians.filter(p => p.practiceId === practiceId);
};

export const searchPhysicians = async (practiceId: number, query: string): Promise<ReferringPhysician[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const lowercaseQuery = query.toLowerCase();
  return mockPhysicians.filter(physician => 
    physician.practiceId === practiceId && (
      physician.name.toLowerCase().includes(lowercaseQuery) ||
      physician.specialty.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const addPhysician = async (physician: Omit<ReferringPhysician, 'id'>): Promise<ReferringPhysician> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newPhysician: ReferringPhysician = {
    ...physician,
    id: physicianIdCounter++
  };
  mockPhysicians.push(newPhysician);
  return newPhysician;
};

export const fetchPracticeContacts = async (practiceId: number): Promise<PracticeContact[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockContacts.filter(c => c.practiceId === practiceId);
};