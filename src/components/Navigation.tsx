import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  Stethoscope, 
  GitPullRequest, 
  TrendingUp, 
  BarChart2, 
  FileText,
  LogOut,
  Heart,
  Bell,
  Search,
  KanbanSquare 
} from 'lucide-react';

const Navigation = () => {
  const { userRole, logout } = useAuth();
  const location = useLocation();

  const isActiveLink = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
        isActiveLink(to)
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 mr-8">
              <Heart size={32} className="text-blue-600" strokeWidth={2} />
              <span className="text-xl font-semibold text-gray-900">HealthCare</span>
            </Link>
            <div className="flex items-center space-x-1">
              <NavLink to="/dashboard" icon={BarChart2}>Dashboard</NavLink>
              {userRole === 'Provider' && (
                <>
                  <NavLink to="/patients" icon={Users}>Patients</NavLink>
                  <NavLink to="/wound-cases" icon={Stethoscope}>Cases</NavLink>
                </>
              )}
              {userRole === 'Coordinator' && (
                <NavLink to="/referrals" icon={KanbanSquare}>Referrals</NavLink>
              )}
              {userRole === 'BDR' && (
                <NavLink to="/business-development" icon={TrendingUp}>Business</NavLink>
              )}
              {userRole === 'Executive' && (
                <NavLink to="/executive-dashboard" icon={BarChart2}>Executive</NavLink>
              )}
              <NavLink to="/reporting" icon={FileText}>Reports</NavLink>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              <Bell size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;