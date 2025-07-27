import React from 'react';
import { Users, Briefcase } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'hr' | 'applicant') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Health Agency</h1>
          <p className="text-gray-600 mt-2">Choose how you'd like to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect('applicant')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">I'm looking for a job</h3>
                <p className="text-sm text-gray-600">Browse and apply for open positions</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleSelect('hr')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">I'm from HR</h3>
                <p className="text-sm text-gray-600">Manage jobs and applications</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your selection will determine the interface you see</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;