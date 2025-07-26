import React from 'react';
import { Users, FileText, Calendar, TrendingUp, Clock, CheckCircle, XCircle, UserCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Applications',
      value: '247',
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Candidates',
      value: '89',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Interviews Scheduled',
      value: '23',
      change: '+5%',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      name: 'Hires This Month',
      value: '12',
      change: '+15%',
      changeType: 'increase',
      icon: UserCheck,
      color: 'bg-orange-500'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Frontend Developer',
      appliedDate: '2024-01-15',
      status: 'pending',
      experience: '3 years'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'UI/UX Designer',
      appliedDate: '2024-01-14',
      status: 'reviewed',
      experience: '5 years'
    },
    {
      id: 3,
      name: 'Emily Davis',
      position: 'Backend Developer',
      appliedDate: '2024-01-13',
      status: 'interviewed',
      experience: '4 years'
    },
    {
      id: 4,
      name: 'David Wilson',
      position: 'Product Manager',
      appliedDate: '2024-01-12',
      status: 'hired',
      experience: '6 years'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'interviewed':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'hired':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'reviewed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'interviewed':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'hired':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your recruitment.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <p className="text-sm text-gray-600">Latest candidate applications across all positions</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {application.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{application.name}</h3>
                    <p className="text-sm text-gray-600">{application.position} • {application.experience}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Applied on</p>
                    <p className="text-sm font-medium text-gray-900">{application.appliedDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className={getStatusBadge(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
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