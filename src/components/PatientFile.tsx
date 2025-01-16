import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MapPin, Edit2, Stethoscope, FileText, 
  MessageCircle, Calendar, Users, Activity, ChevronDown,
  Clock, Thermometer, Star
} from 'lucide-react';
import { fetchPatientById, updatePatient } from '../api/patientApi';
import { DetailedPatient } from '../types/referral';
import EditModal from './EditModal';
import Toast from './Toast';

const PatientFile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<DetailedPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('medical');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modal states
  const [editingSection, setEditingSection] = useState<'personal' | 'insurance' | 'wound' | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const statusOptions = ['Active', 'Inactive', 'On Hold', 'Discharged', 'Archived'];

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPatientById(Number(id));
        setPatient(data);
      } catch (err) {
        console.error('Failed to load patient:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPatient();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!patient?.id) return;
      
      const updated = await updatePatient(patient.id, { ...patient, status: newStatus });
      setPatient(updated);
      setShowStatusDropdown(false);
      setToast({ message: 'Status updated successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to update status:', err);
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleEdit = (section: 'personal' | 'insurance' | 'wound') => {
    setEditingSection(section);
    switch (section) {
      case 'personal':
        setEditData({
          email: patient?.email,
          contactNumber: patient?.contactNumber,
          addressLine1: patient?.addressLine1,
          addressLine2: patient?.addressLine2,
          city: patient?.city,
          state: patient?.state,
          zipCode: patient?.zipCode,
          emergencyContact: patient?.emergencyContact,
        });
        break;
      case 'insurance':
        setEditData({
          primaryInsurance: patient?.primaryInsurance,
          secondaryInsurance: patient?.secondaryInsurance,
        });
        break;
      case 'wound':
        setEditData({
          wounds: patient?.wounds,
        });
        break;
    }
  };

  const handleSave = async (section: string, data: any) => {
    try {
      if (!patient?.id) return;

      const updated = await updatePatient(patient.id, { ...patient, ...data });
      setPatient(updated);
      setEditingSection(null);
      setToast({ message: 'Changes saved successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to save changes:', err);
      setToast({ message: 'Failed to save changes', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600">{error || 'Patient not found'}</p>
        <button
          onClick={() => navigate('/patients')}
          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Return to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Patients
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200"></div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-gray-500">Patient ID: {patient.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Phone className="w-5 h-5 mr-2" />
                Call Patient
              </button>
              <button 
                onClick={() => handleEdit('personal')}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  patient.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                  patient.status === 'Inactive' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                  patient.status === 'On Hold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  patient.status === 'Discharged' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <span>Status: {patient.status}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Days Since Last Visit</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">14 Days</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Wound Status</p>
                  <p className="mt-1 text-2xl font-semibold text-green-600">Healing</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Thermometer className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient Satisfaction</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">4.8/5</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('medical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'medical'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medical Info
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => handleEdit('personal')}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{patient.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1">
                      {patient.addressLine1}
                      {patient.addressLine2 && <br />}
                      {patient.addressLine2}
                      <br />
                      {patient.city}, {patient.state} {patient.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                    <p className="mt-1">{patient.emergencyContact}</p>
                  </div>
                </div>
              </section>

              {/* Insurance Information */}
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Insurance Information</h2>
                  <button
                    onClick={() => handleEdit('insurance')}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Primary Insurance</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Provider</p>
                        <p className="mt-1">{patient.primaryInsurance.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Group ID</p>
                        <p className="mt-1">{patient.primaryInsurance.groupId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member ID</p>
                        <p className="mt-1">{patient.primaryInsurance.memberId}</p>
                      </div>
                    </div>
                  </div>
                  {patient.secondaryInsurance && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Secondary Insurance</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Provider</p>
                          <p className="mt-1">{patient.secondaryInsurance.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Group ID</p>
                          <p className="mt-1">{patient.secondaryInsurance.groupId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Member ID</p>
                          <p className="mt-1">{patient.secondaryInsurance.memberId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Wound Information */}
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Wound Information</h2>
                  <button
                    onClick={() => handleEdit('wound')}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="space-y-6">
                  {patient.wounds.map((wound, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4 first:border-0 first:pt-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Wound {index + 1} - {wound.location}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dimensions</p>
                          <p className="mt-1">
                            {wound.length} x {wound.width} x {wound.depth} cm
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Age</p>
                          <p className="mt-1">
                            {wound.age} {wound.ageUnit}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="mt-1">{wound.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="text-center py-8 text-gray-500">
              Appointments module coming soon...
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="text-center py-8 text-gray-500">
              Documents module coming soon...
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="text-center py-8 text-gray-500">
              Messages module coming soon...
            </div>
          )}
        </div>
      </div>

      {/* Edit Modals */}
      {editingSection === 'personal' && (
        <EditModal
          isOpen={true}
          title="Edit Personal Information"
          onClose={() => setEditingSection(null)}
          onSave={(data) => handleSave('personal', data)}
          initialData={editData}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'contactNumber', label: 'Phone', type: 'tel', required: true },
            { name: 'addressLine1', label: 'Address Line 1', type: 'text', required: true },
            { name: 'addressLine2', label: 'Address Line 2', type: 'text' },
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'state', label: 'State', type: 'text', required: true },
            { name: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
            { name: 'emergencyContact', label: 'Emergency Contact', type: 'tel', required: true },
          ]}
        />
      )}

      {editingSection === 'insurance' && (
        <EditModal
          isOpen={true}
          title="Edit Insurance Information"
          onClose={() => setEditingSection(null)}
          onSave={(data) => handleSave('insurance', data)}
          initialData={editData}
          fields={[
            { name: 'primaryInsurance.name', label: 'Primary Insurance Provider', type: 'text', required: true },
            { name: 'primaryInsurance.groupId', label: 'Primary Group ID', type: 'text', required: true },
            { name: 'primaryInsurance.memberId', label: 'Primary Member ID', type: 'text', required: true },
            { name: 'secondaryInsurance.name', label: 'Secondary Insurance Provider', type: 'text' },
            { name: 'secondaryInsurance.groupId', label: 'Secondary Group ID', type: 'text' },
            { name: 'secondaryInsurance.memberId', label: 'Secondary Member ID', type: 'text' },
          ]}
        />
      )}

      {editingSection === 'wound' && (
        <EditModal
          isOpen={true}
          title="Edit Wound Information"
          onClose={() => setEditingSection(null)}
          onSave={(data) => handleSave('wound', data)}
          initialData={editData}
          fields={patient.wounds.map((_, index) => [
            { name: `wounds[${index}].location`, label: `Wound ${index + 1} Location`, type: 'text', required: true },
            { name: `wounds[${index}].length`, label: `Wound ${index + 1} Length (cm)`, type: 'text', required: true },
            { name: `wounds[${index}].width`, label: `Wound ${index + 1} Width (cm)`, type: 'text', required: true },
            { name: `wounds[${index}].depth`, label: `Wound ${index + 1} Depth (cm)`, type: 'text', required: true },
            { name: `wounds[${index}].age`, label: `Wound ${index + 1} Age`, type: 'text', required: true },
            { name: `wounds[${index}].description`, label: `Wound ${index + 1} Description`, type: 'textarea', required: true },
          ]).flat()}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PatientFile;