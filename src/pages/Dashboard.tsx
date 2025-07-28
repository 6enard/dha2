import React from 'react';
import { useState } from 'react';
import { Users, FileText, Calendar, TrendingUp, Clock, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import ApplicationDetailsModal from '../components/Applications/ApplicationDetailsModal';
import { Application } from '../types';

const Dashboard: React.FC = () => {
  const { applications, loading } = useApplications();
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  const getStats = () => {
    if (loading || !applications.length) {
      return {
        total: 0,
        pending: 0,
        interviewed: 0,
        hired: 0
      };
    }

    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending' || app.status === 'reviewed').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      hired: applications.filter(app => app.status === 'hired').length
    };
  };

  const statsData = getStats();

  const stats = [
    {
      name: 'Total Applications',
      value: statsData.total.toString(),
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Candidates',
      value: statsData.pending.toString(),
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Interviews Scheduled',
      value: statsData.interviewed.toString(),
      change: '+5%',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      name: 'Hires This Month',
      value: statsData.hired.toString(),
      change: '+15%',
      changeType: 'increase',
      icon: UserCheck,
      color: 'bg-orange-500'
    }
  ];

  const recentApplications = applications.slice(0, 4);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your recruitment.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 flex items-center text-xs sm:text-sm text-green-600">
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
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Applications</h2>
          <p className="text-sm text-gray-600 hidden sm:block">Latest candidate applications across all positions</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No applications yet
              </div>
            ) : (
              recentApplications.map((application) => (
              <div 
                key={application.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer space-y-3 sm:space-y-0"
                onClick={() => setViewingApplication(application)}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {application.firstName[0]}{application.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{application.firstName} {application.lastName}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{application.position} • {application.experience}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-600">Applied on</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(application.appliedDate)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className={getStatusBadge(application.status)}>
                      <span className="hidden sm:inline">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      <span className="sm:hidden">{application.status.charAt(0).toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {viewingApplication && (
        <ApplicationDetailsModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
          onStatusUpdate={async (applicationId, status, notes) => {
            // This will be handled by the modal, we just need to close it
            setViewingApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;