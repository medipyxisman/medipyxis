import React from 'react';
import { Activity, Users, FileText, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    color = 'blue',
    onClick
  }: { 
    icon: React.ElementType, 
    title: string, 
    value: string, 
    change?: string,
    color?: string,
    onClick?: () => void
  }) => (
    <div 
      className={`bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-semibold mt-2 text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-sm font-medium">{change}</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          )}
        </div>
        <div className={`bg-${color}-50 p-4 rounded-xl`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Heart size={40} className="text-blue-600" strokeWidth={2} />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your practice today.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
            <option>All Outlets</option>
            <option>Main Clinic</option>
            <option>Branch Office</option>
          </select>
          <div className="bg-white border border-gray-200 rounded-lg flex">
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Today</button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Week</button>
            <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg">Month</button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Activity} 
          title="Active Cases"
          value="124"
          change="+12.5%"
          color="blue"
          onClick={() => navigate('/patients')}
        />
        <StatCard 
          icon={Users} 
          title="Total Patients"
          value="1,429"
          change="+4.3%"
          color="green"
          onClick={() => navigate('/patients')}
        />
        <StatCard 
          icon={FileText} 
          title="Reports Generated"
          value="89"
          change="+22.4%"
          color="purple"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Recovery Rate"
          value="94%"
          change="+2.1%"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/patients/${i + 1}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New patient registered</p>
                    <p className="text-sm text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patients/${i + 1}`);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/patients/${i + 1}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah Wilson</p>
                    <p className="text-sm text-gray-500">Dental Checkup • 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle accept action
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle reschedule action
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;