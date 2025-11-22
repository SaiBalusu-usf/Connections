import React, { useState } from 'react';
import { Connection } from '../types';
import { Users, Mail, UserPlus, Trash2, MapPin, Activity, Edit2, X, Save } from 'lucide-react';
import PostCreator from './PostCreator';
import VoiceAssistant from './VoiceAssistant';

const ProfessionalView: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([
    { id: '1', name: 'Sarah Jenkins', role: 'Product Manager', company: 'Salesforce', email: 'sarah.j@example.com', notes: 'Met at TechSummit', status: 'Connected', dateAdded: '2023-10-20' }
  ]);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

  const addConnection = (data: Partial<Connection>) => {
    const newConn: Connection = {
      id: Date.now().toString(),
      name: data.name || 'New Contact',
      role: data.role || 'Professional',
      company: data.company || 'Freelance',
      email: data.email || '',
      status: data.status || 'Connected',
      notes: data.notes || '',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setConnections(prev => [newConn, ...prev]);
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  const updateConnection = (updated: Connection) => {
    setConnections(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingConnection(null);
  };

  const handleVoiceData = (type: 'job' | 'connection', data: any) => {
    if (type === 'connection') {
      addConnection(data);
    } else if (type === 'job') {
      // If a professional records a job, treat it as a connection (e.g. Recruiter or Hiring Manager)
      addConnection({
        name: 'Hiring Team',
        role: data.role || 'Recruiter',
        company: data.company || 'Unknown Company',
        status: data.status || 'Applied',
        notes: `Job Interest: ${data.status || 'Applied'}. ${data.notes || ''}`
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Connection Manager */}
      <div className="lg:col-span-7 space-y-6">
        
        <VoiceAssistant onDataParsed={handleVoiceData} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" />
                Connections
              </h2>
              <p className="text-sm text-slate-500">Track your network</p>
            </div>
            <button
              onClick={() => addConnection({})}
              className="flex items-center gap-2 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm rounded-lg transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {connections.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>No connections tracked yet.</p>
              </div>
            ) : (
              connections.map((conn) => (
                <div key={conn.id} className="group bg-white border border-slate-200 p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:border-brand-300">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                        {conn.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{conn.name}</h3>
                        <p className="text-sm text-slate-600">{conn.role} @ {conn.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingConnection(conn)}
                        className="text-slate-300 group-hover:text-brand-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteConnection(conn.id)}
                        className="text-slate-300 group-hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {conn.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        {conn.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Added: {conn.dateAdded}
                    </div>
                    {conn.status && (
                      <div className="flex items-center gap-1.5 text-brand-600 font-medium">
                        <Activity className="w-3 h-3" />
                        {conn.status}
                      </div>
                    )}
                  </div>
                  
                  {conn.notes && (
                    <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600 italic border border-slate-100">
                      "{conn.notes}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Post Creation */}
      <div className="lg:col-span-5">
        <PostCreator audience="professional" />
      </div>

      {/* Edit Modal */}
      {editingConnection && (
        <EditConnectionModal
          connection={editingConnection}
          onSave={updateConnection}
          onCancel={() => setEditingConnection(null)}
        />
      )}
    </div>
  );
};

// Helper Component for Edit Modal
const EditConnectionModal: React.FC<{ 
  connection: Connection; 
  onSave: (conn: Connection) => void; 
  onCancel: () => void 
}> = ({ connection, onSave, onCancel }) => {
  const [formData, setFormData] = useState(connection);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-brand-600" />
            Edit Connection
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input 
                type="text" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input 
                type="text" 
                value={formData.company} 
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
               <input 
                 type="email" 
                 value={formData.email} 
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <input 
                 type="text" 
                 value={formData.status || ''} 
                 onChange={(e) => setFormData({...formData, status: e.target.value})}
                 className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                 placeholder="e.g. Met for Coffee"
               />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
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

export default ProfessionalView;