import React, { useState, useEffect } from 'react';
import { JobApplication } from '../types';
import { exportToCSV } from '../services/csvExport';
import { Download, Briefcase, Calendar, Building, Trash2, Plus, Edit2, X, Save } from 'lucide-react';
import PostCreator from './PostCreator';
import VoiceAssistant from './VoiceAssistant';

const StudentView: React.FC = () => {
  const [jobs, setJobs] = useState<JobApplication[]>([
    { id: '1', company: 'Tech Corp', role: 'Junior Dev', status: 'Applied', dateApplied: '2023-10-24', notes: 'Referral from Jane' }
  ]);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const addJob = (data: Partial<JobApplication>) => {
    const newJob: JobApplication = {
      id: Date.now().toString(),
      company: data.company || 'Unknown Company',
      role: data.role || 'Unknown Role',
      status: data.status || 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
      notes: data.notes || ''
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const updateJob = (updatedJob: JobApplication) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    setEditingJob(null);
  };

  const handleVoiceData = (type: 'job' | 'connection', data: any) => {
    if (type === 'job') {
      addJob(data);
    } else if (type === 'connection') {
      // If a student records a connection, treat it as a job lead/networking opportunity
      addJob({
        company: data.company || 'Networking',
        role: data.role || 'Contact',
        status: data.status || 'Networking',
        notes: `New Contact: ${data.name} (${data.email || 'No email'}). ${data.notes || ''}`
      });
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('applied') || s.includes('sent')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (s.includes('interview') || s.includes('call')) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (s.includes('offer') || s.includes('accepted')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (s.includes('reject') || s.includes('deny')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'; // Default for custom statuses
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Job Tracking (Spreadsheet vibe) */}
      <div className="lg:col-span-7 space-y-6">
        
        <VoiceAssistant onDataParsed={handleVoiceData} />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[600px] transition-colors duration-300">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Job Tracking
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your applications</p>
            </div>
            <button
              onClick={() => exportToCSV(jobs, 'job_applications')}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Excel Export
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-3">Company</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Table Body (Scrollable) */}
          <div className="overflow-y-auto flex-1">
            {jobs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Briefcase className="w-12 h-12 mb-2 opacity-20" />
                <p>No applications tracked yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors items-center">
                  <div className="col-span-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {job.company}
                  </div>
                  <div className="col-span-3 text-slate-600 dark:text-slate-300 text-sm truncate">{job.role}</div>
                  <div className="col-span-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {job.dateApplied}
                  </div>
                  <div className="col-span-1 text-center flex justify-center gap-2">
                    <button 
                      onClick={() => setEditingJob(job)}
                      className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Add Button */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
             <button 
                onClick={() => addJob({ company: 'New Company', role: 'Role', status: 'Prospecting' })}
                className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
             >
               <Plus className="w-4 h-4" />
               Add Manual Entry
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: LinkedIn Post Creation */}
      <div className="lg:col-span-5">
        <PostCreator audience="student" />
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <EditJobModal 
          job={editingJob} 
          onSave={updateJob} 
          onCancel={() => setEditingJob(null)} 
        />
      )}
    </div>
  );
};

// Helper Component for Edit Modal
const EditJobModal: React.FC<{ 
  job: JobApplication; 
  onSave: (job: JobApplication) => void; 
  onCancel: () => void 
}> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState(job);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Edit Application
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
            <input 
              type="text" 
              value={formData.company} 
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <input 
                type="text" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <input 
                type="text" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Applied"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Applied</label>
            <input 
              type="date" 
              value={formData.dateApplied} 
              onChange={(e) => setFormData({...formData, dateApplied: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentView;