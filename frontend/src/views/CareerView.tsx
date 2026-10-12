import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Building,
  Calendar,
  ExternalLink,
  Mail,
  User,
  Trash2,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus, CareerApplication } from '../types';

export const CareerView: React.FC = () => {
  const { career, addCareer, updateCareer, deleteCareer } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [contactName, setContactName] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const statuses: { id: ApplicationStatus; label: string; color: string }[] = [
    { id: 'SAVED', label: 'Saved / Prospecting', color: 'bg-slate-800 text-slate-300' },
    { id: 'APPLIED', label: 'Applied', color: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
    { id: 'INTERVIEWING', label: 'Interviewing', color: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
    { id: 'OFFER', label: 'Offer Received', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'REJECTED', label: 'Archived / Rejected', color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    addCareer({
      company: company.trim(),
      role: role.trim(),
      salaryExpectation: salary.trim() || undefined,
      applicationDate: new Date().toISOString().split('T')[0],
      status,
      contactName: contactName.trim() || undefined,
      interviewDate: interviewDate || undefined,
      notes: 'Initial application logged in LifeOS Career Tracker.'
    });
    setCompany('');
    setRole('');
    setSalary('');
    setContactName('');
    setInterviewDate('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-sky-400" /> Work & Career Workspace
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Job opportunity pipeline, interview preparation, and compensation tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Ethical Career Automation:</strong> LifeOS tracks your pipeline without scraping job portals or sending unsolicited resumes without your explicit approval.
        </span>
      </div>

      {/* Add Modal / Form */}
      {isAddOpen && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Log Job Application</span>
            <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Company Name (e.g. CloudScale Tech)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
            <input
              type="text"
              required
              placeholder="Role Title (e.g. Staff Architect)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Salary Target / Range"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="SAVED">Saved / Prospecting</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Archived</option>
            </select>
            <input
              type="date"
              placeholder="Upcoming Interview Date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
          >
            Save Pipeline Record
          </button>
        </form>
      )}

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {career.map(app => (
          <div
            key={app.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-400" /> {app.company}
                </span>
                <h3 className="text-base font-bold text-white truncate">{app.role}</h3>
                {app.salaryExpectation && (
                  <p className="text-xs text-emerald-400 font-semibold">{app.salaryExpectation}</p>
                )}
              </div>

              {/* Status Switcher Dropdown */}
              <select
                value={app.status}
                onChange={(e) => updateCareer(app.id, { status: e.target.value as ApplicationStatus })}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold focus:outline-none text-slate-200"
              >
                <option value="SAVED">Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Interview Prep Alert */}
            {app.interviewDate && (
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Interview scheduled on <strong>{app.interviewDate}</strong></span>
                </div>
              </div>
            )}

            {app.interviewNotes && (
              <p className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                {app.interviewNotes}
              </p>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Applied on {app.applicationDate}</span>
              <button
                onClick={() => deleteCareer(app.id)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
