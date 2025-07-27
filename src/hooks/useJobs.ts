import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { Job } from '../types';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdDate'>) => {
    try {
      await jobService.createJob(jobData);
      await fetchJobs();
    } catch (err) {
      setError('Failed to create job');
      console.error('Error creating job:', err);
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      await jobService.updateJob(jobId, updates);
      await fetchJobs();
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await jobService.deleteJob(jobId);
      await fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    createJob,
    updateJob,
    deleteJob
  };
};