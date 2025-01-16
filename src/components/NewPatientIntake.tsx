import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  addPatient, 
  fetchReferringPractices, 
  fetchPhysiciansByPractice,
  fetchPracticeContacts,
  searchPractices,
  addReferringPractice,
  searchPhysicians,
  addPhysician
} from '../api/referralCoordinatorApi';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import type { ReferringPractice, ReferringPhysician, PracticeContact, Wound } from '../types/referral';

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const insuranceProviders = [
  'Blue Cross',
  'Aetna',
  'UnitedHealth',
  'Cigna',
  'Humana',
  'Medicare',
  'Medicaid',
  'Other'
];

const NewPatientIntake: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    noInsurance: false,
    primaryInsurance: {
      name: '',
      groupId: '',
      memberId: ''
    },
    secondaryInsurance: {
      name: '',
      groupId: '',
      memberId: ''
    },
    preferredProvider: ''
  });

  // Add new state for practices and wounds
  const [practices, setPractices] = useState<ReferringPractice[]>([]);
  const [physicians, setPhysicians] = useState<ReferringPhysician[]>([]);
  const [contacts, setContacts] = useState<PracticeContact[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<string>('');
  const [selectedPhysician, setSelectedPhysician] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [wounds, setWounds] = useState<Wound[]>([{
    location: '',
    length: 0,
    width: 0,
    depth: 0,
    age: 0,
    ageUnit: 'days',
    description: '',
    images: []
  }]);

  // Load practices on component mount
  useEffect(() => {
    const loadPractices = async () => {
      try {
        const data = await fetchReferringPractices();
        setPractices(data);
      } catch (error) {
        console.error('Failed to load practices:', error);
      }
    };
    loadPractices();
  }, []);

  // Load physicians and contacts when practice is selected
  const handlePracticeChange = async (practiceId: string) => {
    setSelectedPractice(practiceId);
    if (!practiceId) {
      setPhysicians([]);
      setContacts([]);
      return;
    }

    try {
      const [physiciansData, contactsData] = await Promise.all([
        fetchPhysiciansByPractice(Number(practiceId)),
        fetchPracticeContacts(Number(practiceId))
      ]);
      setPhysicians(physiciansData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load practice data:', error);
    }
  };

  // Handle wound form changes
  const handleWoundChange = (index: number, field: keyof Wound, value: any) => {
    const newWounds = [...wounds];
    newWounds[index] = { ...newWounds[index], [field]: value };
    setWounds(newWounds);
  };

  const addWound = () => {
    setWounds([...wounds, {
      location: '',
      length: 0,
      width: 0,
      depth: 0,
      age: 0,
      ageUnit: 'days',
      description: '',
      images: []
    }]);
  };

  const removeWound = (index: number) => {
    setWounds(wounds.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Combine all form data
      const patientData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        status: 'New',
        referralDate: new Date().toISOString(),
        referringPractice: selectedPractice,
        referringPhysician: selectedPhysician,
        officeContact: selectedContact,
        wounds
      };

      await addPatient(patientData);
      navigate('/referrals');
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/referrals')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Referrals
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Patient Intake Form</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2 <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    pattern="[0-9]{5}"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  required
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </section>

          {/* Referring Practice Section */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Referring Practice Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Referring Practice</label>
                <select
                  value={selectedPractice}
                  onChange={(e) => handlePracticeChange(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select practice</option>
                  {practices.map(practice => (
                    <option key={practice.id} value={practice.id}>
                      {practice.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Referring Physician</label>
                <select
                  value={selectedPhysician}
                  onChange={(e) => setSelectedPhysician(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select physician</option>
                  {physicians.map(physician => (
                    <option key={physician.id} value={physician.id}>
                      {physician.name} - {physician.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Office Contact</label>
                <select
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Insurance Information */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="noInsurance"
                  checked={formData.noInsurance}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Patient has no insurance
                </label>
              </div>

              {!formData.noInsurance && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Primary Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance Name</label>
                        <select
                          name="primaryInsurance.name"
                          required={!formData.noInsurance}
                          value={formData.primaryInsurance.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select insurance</option>
                          {insuranceProviders.map(provider => (
                            <option key={provider} value={provider}>{provider}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Group ID</label>
                        <input
                          type="text"
                          name="primaryInsurance.groupId"
                          required={!formData.noInsurance}
                          value={formData.primaryInsurance.groupId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Member ID</label>
                        <input
                          type="text"
                          name="primaryInsurance.memberId"
                          required={!formData.noInsurance}
                          value={formData.primaryInsurance.memberId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Secondary Insurance (if applicable)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance Name</label>
                        <select
                          name="secondaryInsurance.name"
                          value={formData.secondaryInsurance.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select insurance</option>
                          {insuranceProviders.map(provider => (
                            <option key={provider} value={provider}>{provider}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Group ID</label>
                        <input
                          type="text"
                          name="secondaryInsurance.groupId"
                          value={formData.secondaryInsurance.groupId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Member ID</label>
                        <input
                          type="text"
                          name="secondaryInsurance.memberId"
                          value={formData.secondaryInsurance.memberId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Wound Information Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Wound Information</h2>
              <button
                type="button"
                onClick={addWound}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Plus size={16} />
                <span>Add Another Wound</span>
              </button>
            </div>

            <div className="space-y-6">
              {wounds.map((wound, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">Wound {index + 1}</h3>
                    {wounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWound(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        required
                        value={wound.location}
                        onChange={(e) => handleWoundChange(index, 'location', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Left lower leg"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.1"
                          value={wound.length}
                          onChange={(e) => handleWoundChange(index, 'length', Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.1"
                          value={wound.width}
                          onChange={(e) => handleWoundChange(index, 'width', Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Depth (cm)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.1"
                          value={wound.depth}
                          onChange={(e) => handleWoundChange(index, 'depth', Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={wound.age}
                          onChange={(e) => handleWoundChange(index, 'age', Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                          value={wound.ageUnit}
                          onChange={(e) => handleWoundChange(index, 'ageUnit', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        required
                        value={wound.description}
                        onChange={(e) => handleWoundChange(index, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Describe the wound characteristics, appearance, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Images</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload files</span>
                              <input
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  handleWoundChange(index, 'images', files);
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Provider Information */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Provider Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Home Health Provider</label>
              <input
                type="text"
                name="preferredProvider"
                value={formData.preferredProvider}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter preferred provider name"
              />
            </div>
          </section>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/referrals')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatientIntake;