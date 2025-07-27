import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { Application } from '../types';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status'], notes?: string, changedBy?: string) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status, notes, changedBy);
      // Refresh applications after update
      await fetchApplications();
    } catch (err) {
      setError('Failed to update application status');
      console.error('Error updating application status:', err);
    }
  };

  const createApplication = async (applicationData: Omit<Application, 'id' | 'appliedDate'>) => {
    try {
      await applicationService.createApplication(applicationData);
      await fetchApplications();
    } catch (err) {
      setError('Failed to create application');
      console.error('Error creating application:', err);
    }
  };

  const updateApplication = async (applicationId: string, updates: Partial<Application>) => {
    try {
      await applicationService.updateApplication(applicationId, updates);
      await fetchApplications();
    } catch (err) {
      setError('Failed to update application');
      console.error('Error updating application:', err);
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      await applicationService.deleteApplication(applicationId);
      // Refresh applications after deletion
      await fetchApplications();
    } catch (err) {
      setError('Failed to delete application');
      console.error('Error deleting application:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication
  };
};