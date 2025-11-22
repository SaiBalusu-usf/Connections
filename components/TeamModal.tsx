import React, { useState } from 'react';
import { TeamMember } from '../types';
import { X, UserPlus, Trash2, Github, Linkedin, User } from 'lucide-react';

interface TeamModalProps {
  members: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onRemoveMember: (id: string) => void;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ members, onAddMember, onRemoveMember, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({ name: '', role: '', bio: '' });

  const handleAdd = () => {
    if (newMember.name && newMember.role) {
      onAddMember({
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        bio: newMember.bio
      });
      setNewMember({ name: '', role: '', bio: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Project Team</h2>
            <p className="text-slate-500 text-sm">The minds behind Connections</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div key={member.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-brand-200 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-indigo-100 flex items-center justify-center text-brand-600 font-bold text-xl shadow-inner">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-brand-600 text-sm font-medium mb-1">{member.role}</p>
                    {member.bio && <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>}
                    
                    <div className="flex gap-2 mt-3">
                      <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors">
                        <Github className="w-3 h-3" />
                      </div>
                      <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                        <Linkedin className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveMember(member.id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:bg-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Add Team Member</span>
              </button>
            )}
          </div>

          {/* Add Member Form */}
          {isAdding && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                New Member Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Designer)"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Short bio..."
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none mb-3 h-20 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={!newMember.name || !newMember.role}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Add Member
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
          Connections Project © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default TeamModal;