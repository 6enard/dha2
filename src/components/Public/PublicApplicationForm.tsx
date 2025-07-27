import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Job } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';
import DocumentUpload from './DocumentUpload';

interface PublicApplicationFormProps {
  job: Job;
  onClose: () => void;
}

const PublicApplicationForm: React.FC<PublicApplicationFormProps> = ({ job, onClose }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    salary: '',
    coverLetter: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    resume?: File;
    coverLetter?: File;
    portfolio?: File;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // For now, we'll store document metadata without uploading files
      // This avoids CORS issues with Firebase Storage
      const documents: any = {};
      
      if (uploadedFiles.resume) {
        documents.resume = {
          name: uploadedFiles.resume.name,
          size: uploadedFiles.resume.size,
          type: uploadedFiles.resume.type,
          uploadedAt: new Date(),
          status: 'pending_upload'
        };
      }

      if (uploadedFiles.coverLetter) {
        documents.coverLetter = {
          name: uploadedFiles.coverLetter.name,
          size: uploadedFiles.coverLetter.size,
          type: uploadedFiles.coverLetter.type,
          uploadedAt: new Date(),
          status: 'pending_upload'
        };
      }

      if (uploadedFiles.portfolio) {
        documents.portfolio = {
          name: uploadedFiles.portfolio.name,
          size: uploadedFiles.portfolio.size,
          type: uploadedFiles.portfolio.type,
          uploadedAt: new Date(),
          status: 'pending_upload'
        };
      }

      const applicationData = {
        ...formData,
        position: job.title,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        status: 'pending' as const,
        applicantId: currentUser!.uid,
        documents
      };

      await applicationService.createApplication(applicationData);
      setIsSubmitted(true);
    } catch (err) {
      setError(`Failed to submit application: ${err instanceof Error ? err.message : 'Please try again.'}`);
      console.error('Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileSelect = (file: File, type: 'resume' | 'coverLetter' | 'portfolio') => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleFileRemove = (type: 'resume' | 'coverLetter' | 'portfolio') => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in the {job.title} position. We'll review your application and get back to you soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
            <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm font-medium text-blue-900">Submitting your application...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 3 years"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., $60,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education *
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
              placeholder="e.g., Bachelor's in Computer Science"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Document Upload Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
            <DocumentUpload
              onFileSelect={handleFileSelect}
              uploadedFiles={uploadedFiles}
              onFileRemove={handleFileRemove}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Position Details:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Role:</strong> {job.title}</p>
              <p><strong>Department:</strong> {job.department}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}</p>
              {job.salaryRange && <p><strong>Salary Range:</strong> {job.salaryRange}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicApplicationForm;