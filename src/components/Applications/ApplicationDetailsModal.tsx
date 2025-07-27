import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, FileText, Download, Eye, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Application } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
  onStatusUpdate: (applicationId: string, status: Application['status'], notes?: string) => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ 
  application, 
  onClose, 
  onStatusUpdate 
}) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleStatusUpdate = async (newStatus: Application['status']) => {
    setIsUpdatingStatus(true);
    try {
      await onStatusUpdate(application.id, newStatus, notes);
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDocumentDownload = (documentUrl: string, documentName: string) => {
    // In a real app, this would handle secure document download
    window.open(documentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {application.firstName[0]}{application.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {application.firstName} {application.lastName}
              </h2>
              <p className="text-gray-600">{application.position}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{application.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{application.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-700">{application.experience}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-700">{application.education}</p>
                </div>

                {application.skills && application.skills.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.salary && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Expected Salary</h3>
                    <p className="text-gray-700">{application.salary}</p>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Documents */}
              {application.documents && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2">
                    {application.documents.resume && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Resume</p>
                            <p className="text-sm text-gray-600">{application.documents.resume.name}</p>
                            {application.documents.resume.status === 'uploaded' && (
                              <p className="text-xs text-green-600">✓ Successfully uploaded</p>
                            )}
                            {application.documents.resume.status === 'failed' && (
                              <p className="text-xs text-red-600">⚠ Upload failed</p>
                            )}
                            {application.documents.resume.status === 'pending_upload' && (
                              <p className="text-xs text-orange-600">⏳ File pending upload</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {application.documents.resume.url ? (
                            <>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.resume!.url, application.documents!.resume!.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.resume!.url, application.documents!.resume!.name)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded ${
                              application.documents.resume.status === 'failed' 
                                ? 'text-red-600 bg-red-100' 
                                : 'text-gray-500 bg-gray-100'
                            }`}>
                              {application.documents.resume.status === 'failed' ? 'Upload failed' : 'File not available'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {application.documents.coverLetter && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">Cover Letter</p>
                            <p className="text-sm text-gray-600">{application.documents.coverLetter.name}</p>
                            {application.documents.coverLetter.status === 'uploaded' && (
                              <p className="text-xs text-green-600">✓ Successfully uploaded</p>
                            )}
                            {application.documents.coverLetter.status === 'failed' && (
                              <p className="text-xs text-red-600">⚠ Upload failed</p>
                            )}
                            {application.documents.coverLetter.status === 'pending_upload' && (
                              <p className="text-xs text-orange-600">⏳ File pending upload</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {application.documents.coverLetter.url ? (
                            <>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.coverLetter!.url, application.documents!.coverLetter!.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.coverLetter!.url, application.documents!.coverLetter!.name)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded ${
                              application.documents.coverLetter.status === 'failed' 
                                ? 'text-red-600 bg-red-100' 
                                : 'text-gray-500 bg-gray-100'
                            }`}>
                              {application.documents.coverLetter.status === 'failed' ? 'Upload failed' : 'File not available'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {application.documents.portfolio && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="font-medium text-gray-900">Portfolio</p>
                            <p className="text-sm text-gray-600">{application.documents.portfolio.name}</p>
                            {application.documents.portfolio.status === 'uploaded' && (
                              <p className="text-xs text-green-600">✓ Successfully uploaded</p>
                            )}
                            {application.documents.portfolio.status === 'failed' && (
                              <p className="text-xs text-red-600">⚠ Upload failed</p>
                            )}
                            {application.documents.portfolio.status === 'pending_upload' && (
                              <p className="text-xs text-orange-600">⏳ File pending upload</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {application.documents.portfolio.url ? (
                            <>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.portfolio!.url, application.documents!.portfolio!.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDocumentDownload(application.documents!.portfolio!.url, application.documents!.portfolio!.name)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded ${
                              application.documents.portfolio.status === 'failed' 
                                ? 'text-red-600 bg-red-100' 
                                : 'text-gray-500 bg-gray-100'
                            }`}>
                              {application.documents.portfolio.status === 'failed' ? 'Upload failed' : 'File not available'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Application Status</h3>
                <div className={getStatusBadge(application.status)}>
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Applied on {formatDate(application.appliedDate)}
                </p>
              </div>

              {/* Status Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                <div className="space-y-2">
                  {['pending', 'reviewed', 'interviewed', 'hired', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status as Application['status'])}
                      disabled={isUpdatingStatus || application.status === status}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        application.status === status
                          ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
              </div>

              {/* Application Notes */}
              {application.notes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{application.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;