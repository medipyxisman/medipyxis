import axios from 'axios';
import { DetailedPatient } from '../types/referral';

// Mock detailed patient data for development/testing
const mockDetailedPatients: DetailedPatient[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Wilson',
    name: 'Sarah Wilson',
    status: 'Active',
    dateOfBirth: '1990-05-15',
    referralDate: '2024-03-15',
    email: 'sarah.wilson@example.com',
    contactNumber: '(555) 123-4567',
    addressLine1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    emergencyContact: '(555) 987-6543',
    insuranceProvider: 'Blue Cross',
    primaryInsurance: {
      name: 'Blue Cross',
      groupId: 'BC123456',
      memberId: 'MEM789012'
    },
    wounds: [
      {
        location: 'Left lower leg',
        length: 5.2,
        width: 3.1,
        depth: 0.5,
        age: 14,
        ageUnit: 'days',
        description: 'Venous ulcer with moderate exudate'
      }
    ],
    preferredProvider: 'City Home Health Services'
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Brown',
    name: 'Michael Brown',
    status: 'Completed',
    dateOfBirth: '1985-08-22',
    referralDate: '2024-03-14',
    email: 'michael.brown@example.com',
    contactNumber: '(555) 234-5678',
    addressLine1: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    emergencyContact: '(555) 876-5432',
    insuranceProvider: 'Aetna',
    primaryInsurance: {
      name: 'Aetna',
      groupId: 'AE789012',
      memberId: 'MEM345678'
    },
    wounds: [
      {
        location: 'Right foot',
        length: 3.5,
        width: 2.8,
        depth: 0.3,
        age: 21,
        ageUnit: 'days',
        description: 'Diabetic ulcer showing signs of improvement'
      }
    ],
    preferredProvider: 'Valley Home Health'
  },
  {
    id: 3,
    firstName: 'Emma',
    lastName: 'Davis',
    name: 'Emma Davis',
    status: 'Scheduled',
    dateOfBirth: '1992-03-10',
    referralDate: '2024-03-13',
    email: 'emma.davis@example.com',
    contactNumber: '(555) 345-6789',
    addressLine1: '789 Pine St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    emergencyContact: '(555) 765-4321',
    insuranceProvider: 'UnitedHealth',
    primaryInsurance: {
      name: 'UnitedHealth',
      groupId: 'UH345678',
      memberId: 'MEM901234'
    },
    wounds: [
      {
        location: 'Left ankle',
        length: 4.0,
        width: 2.5,
        depth: 0.4,
        age: 7,
        ageUnit: 'days',
        description: 'Post-surgical wound with minimal drainage'
      }
    ],
    preferredProvider: 'Metro Home Care'
  }
];

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchPatientById = async (id: number): Promise<DetailedPatient> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!id) {
      throw new ApiError('Patient ID is required', 400, 'MISSING_ID');
    }

    const patient = mockDetailedPatients.find(p => p.id === id);
    
    if (!patient) {
      throw new ApiError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    return patient;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to fetch patient data';
      throw new ApiError(message, status, error.code);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'An unexpected error occurred while fetching patient data',
      500,
      'INTERNAL_ERROR'
    );
  }
};

export const updatePatient = async (
  id: number,
  data: Partial<DetailedPatient>
): Promise<DetailedPatient> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!id) {
      throw new ApiError('Patient ID is required', 400, 'MISSING_ID');
    }

    const patientIndex = mockDetailedPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      throw new ApiError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    mockDetailedPatients[patientIndex] = {
      ...mockDetailedPatients[patientIndex],
      ...data,
      id
    };

    return mockDetailedPatients[patientIndex];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to update patient data';
      throw new ApiError(message, status, error.code);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'An unexpected error occurred while updating patient data',
      500,
      'INTERNAL_ERROR'
    );
  }
};

export const deletePatient = async (id: number): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!id) {
      throw new ApiError('Patient ID is required', 400, 'MISSING_ID');
    }

    const patientIndex = mockDetailedPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      throw new ApiError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    mockDetailedPatients.splice(patientIndex, 1);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to delete patient';
      throw new ApiError(message, status, error.code);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'An unexpected error occurred while deleting patient',
      500,
      'INTERNAL_ERROR'
    );
  }
};