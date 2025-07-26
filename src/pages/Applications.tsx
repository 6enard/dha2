import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MoreHorizontal, Clock, CheckCircle, XCircle, Calendar, FileText } from 'lucide-react';

const Applications: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applications = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Frontend Developer',
      experience: '3 years',
      appliedDate: '2024-01-15',
      status: 'pending',
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
      education: "Bachelor's in Computer Science"
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      position: 'UI/UX Designer',
      experience: '5 years',
      appliedDate: '2024-01-14',
      status: 'reviewed',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
      education: "Bachelor's in Design"
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      position: 'Backend Developer',
      experience: '4 years',
      appliedDate: '2024-01-13',
      status: 'interviewed',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
      education: "Master's in Software Engineering"
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Product Manager',
      experience: '6 years',
      appliedDate: '2024-01-12',
      status: 'hired',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
      education: "MBA in Business Administration"
    },
    {
      id: 5,
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 567-8901',
      position: 'Data Scientist',
      experience: '2 years',
      appliedDate: '2024-01-11',
      status: 'rejected',
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
      education: "PhD in Data Science"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(app => app.status === 'pending').length },
    { id: 'reviewed', label: 'Reviewed', count: applications.filter(app => app.status === 'reviewed').length },
    { id: 'interviewed', label: 'Interviewed', count: applications.filter(app => app.status === 'interviewed').length },
    { id: 'hired', label: 'Hired', count: applications.filter(app => app.status === 'hired').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
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
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1";
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

  const filteredApplications = applications.filter(app => {
    const matchesFilter = selectedFilter === 'all' || app.status === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review all job applications</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
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

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Candidate</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Position</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Experience</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Applied Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {application.firstName[0]}{application.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.firstName} {application.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{application.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{application.position}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {application.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{application.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{application.experience}</td>
                  <td className="py-4 px-6 text-gray-900">{application.appliedDate}</td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(application.status)}>
                      {getStatusIcon(application.status)}
                      <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;