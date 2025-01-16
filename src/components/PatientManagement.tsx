import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientManagement = () => {
  const navigate = useNavigate();
  const patients = [
    { id: 1, name: 'Sarah Wilson', status: 'Active', lastVisit: '2023-11-23', nextVisit: '2023-12-15' },
    { id: 2, name: 'Michael Brown', status: 'Completed', lastVisit: '2023-11-20', nextVisit: '2023-12-20' },
    { id: 3, name: 'Emma Davis', status: 'Scheduled', lastVisit: '2023-11-15', nextVisit: '2023-12-01' },
  ];

  const handleRowClick = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage your patient records and appointments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Visit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((patient) => (
                <tr 
                  key={patient.id}
                  onClick={() => handleRowClick(patient.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        patient.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.nextVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when clicking the button
                        navigate(`/patients/${patient.id}`);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 3 of 3 results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;