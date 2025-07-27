import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Clock, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import JobForm from '../components/Jobs/JobForm';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useJobs();

  const handleCreateJob = async (jobData: Omit<Job, 'id' | 'createdDate'>) => {
    await createJob(jobData);
    setShowJobForm(false);
  };

  const handleUpdateJob = async (jobData: Omit<Job, 'id' | 'createdDate'>) => {
    if (editingJob) {
      await updateJob(editingJob.id, jobData);
      setEditingJob(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await deleteJob(jobId);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filters = [
    { id: 'all', label: 'All Jobs', count: jobs.length },
    { id: 'active', label: 'Active', count: jobs.filter(job => job.status === 'active').length },
    { id: 'paused', label: 'Paused', count: jobs.filter(job => job.status === 'paused').length },
    { id: 'closed', label: 'Closed', count: jobs.filter(job => job.status === 'closed').length }
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'paused':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'closed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'full-time':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'part-time':
        return <Clock className="w-4 h-4 text-green-500" />;
      case 'contract':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'internship':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">Manage and create job opportunities</p>
        </div>
        <button 
          onClick={() => setShowJobForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Job</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.department}</p>
              </div>
              <span className={getStatusBadge(job.status)}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                {getJobTypeIcon(job.type)}
                <span className="ml-2 capitalize">{job.type.replace('-', ' ')}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {job.salaryRange}
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {job.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Posted {formatDate(job.createdDate)}
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setEditingJob(job)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first job posting.</p>
          <button 
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Job
          </button>
        </div>
      )}

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          onSubmit={handleCreateJob}
          onClose={() => setShowJobForm(false)}
        />
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <JobForm
          onSubmit={handleUpdateJob}
          onClose={() => setEditingJob(null)}
          initialData={editingJob}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default Jobs;