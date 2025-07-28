import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Calendar, Eye, ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';

interface ApplicantDashboardProps {
  onBack: () => void;
  onBrowseJobs?: () => void;
}

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ onBack, onBrowseJobs }) => {
  const { currentUser, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchMyApplications();
    }
  }, [currentUser]);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await applicationService.getAllApplications();
      const myApplications = allApplications.filter(app => app.applicantId === currentUser?.uid);
      setApplications(myApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'reviewed':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'interviewed':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full flex items-center space-x-2";
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your application is being reviewed by our HR team.';
      case 'reviewed':
        return 'Your application has been reviewed and is under consideration.';
      case 'interviewed':
        return 'Congratulations! You have been selected for an interview.';
      case 'hired':
        return 'Congratulations! You have been selected for this position.';
      case 'rejected':
        return 'Thank you for your interest. We have decided to move forward with other candidates.';
      default:
        return 'Application status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Role Selection</span>
              </button>
              <button
                onClick={onBrowseJobs}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
              >
                Browse Jobs
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
                  <p className="text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">You haven't applied for any positions yet.</p>
            <button
              onClick={onBrowseJobs || onBack}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.position}</h3>
                    <p className="text-sm text-gray-600">Applied {formatDate(application.appliedDate)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className={getStatusBadge(application.status)}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{application.status}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {getStatusMessage(application.status)}
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {application.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {application.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedApplication.position}</h3>
                <div className={getStatusBadge(selectedApplication.status)}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="capitalize">{selectedApplication.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                  <p className="text-gray-900">{formatDate(selectedApplication.appliedDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{selectedApplication.experience}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <p className="text-gray-900">{selectedApplication.education}</p>
              </div>

              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.documents && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                  <div className="space-y-2">
                    {selectedApplication.documents?.resume && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Resume</p>
                            <p className="text-xs text-gray-600">{selectedApplication.documents.resume.name}</p>
                            <p className="text-xs text-gray-500">
                              Status: {selectedApplication.documents.resume.status === 'uploaded' ? 
                                <span className="text-green-600">Successfully uploaded</span> : 
                                <span className="text-red-600">Upload failed</span>
                              }
                            </p>
                          </div>
                        </div>
                        {selectedApplication.documents.resume.url && (
                          <button
                            onClick={() => window.open(selectedApplication.documents!.resume!.url, '_blank')}
                            className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    )}
                    
                    {selectedApplication.documents?.coverLetter && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Cover Letter</p>
                            <p className="text-xs text-gray-600">{selectedApplication.documents.coverLetter.name}</p>
                            <p className="text-xs text-gray-500">
                              Status: {selectedApplication.documents.coverLetter.status === 'uploaded' ? 
                                <span className="text-green-600">Successfully uploaded</span> : 
                                <span className="text-red-600">Upload failed</span>
                              }
                            </p>
                          </div>
                        </div>
                        {selectedApplication.documents.coverLetter.url && (
                          <button
                            onClick={() => window.open(selectedApplication.documents!.coverLetter!.url, '_blank')}
                            className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    )}
                    
                    {selectedApplication.documents?.portfolio && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Portfolio</p>
                            <p className="text-xs text-gray-600">{selectedApplication.documents.portfolio.name}</p>
                            <p className="text-xs text-gray-500">
                              Status: {selectedApplication.documents.portfolio.status === 'uploaded' ? 
                                <span className="text-green-600">Successfully uploaded</span> : 
                                <span className="text-red-600">Upload failed</span>
                              }
                            </p>
                          </div>
                        </div>
                        {selectedApplication.documents.portfolio.url && (
                          <button
                            onClick={() => window.open(selectedApplication.documents!.portfolio!.url, '_blank')}
                            className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Status Information</h4>
                <p className="text-sm text-blue-800">{getStatusMessage(selectedApplication.status)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;