import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  Download,
  RotateCcw,
  Trash2,
  Moon,
  Sun,
  Globe,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportAllDataAsJson, exportTasksAsCsv } from '../services/storage';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    toggleTheme,
    resetAllDemoData
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [timeZone, setTimeZone] = useState(user.timeZone);
  const [language, setLanguage] = useState(user.preferredLanguage);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      timeZone,
      preferredLanguage: language
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportJson = () => {
    const dataStr = exportAllDataAsJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCsv = () => {
    const csvStr = exportTasksAsCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-teal-400" /> Settings, Privacy & Data Control
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Configure profile preferences, security controls, connected AI providers, and full data exports.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Preferences updated and persisted successfully!
        </div>
      )}

      {/* Profile Form Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-teal-400" /> Personal Profile
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Zone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="America/New_York (UTC-5)">Eastern Time (US & Canada)</option>
                <option value="America/Chicago (UTC-6)">Central Time (US & Canada)</option>
                <option value="America/Los_Angeles (UTC-8)">Pacific Time (US & Canada)</option>
                <option value="Europe/London (UTC+0)">London (GMT)</option>
                <option value="Europe/Paris (UTC+1)">Central European Time</option>
                <option value="Asia/Kolkata (UTC+5:30)">India Standard Time (IST)</option>
                <option value="Asia/Tokyo (UTC+9)">Tokyo (JST)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
          >
            Save Profile Settings
          </button>
        </form>
      </div>

      {/* Appearance & Theme */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          {user.theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />} Appearance
        </h2>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-200">Current Theme: {user.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            <p className="text-[11px] text-slate-400">High-contrast accessibility palette tailored for clarity and low eye fatigue.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
          >
            Switch to {user.theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* AI Provider Credentials */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" /> Model-Independent AI Provider
        </h2>

        <p className="text-xs text-slate-400">
          LifeOS operates with an internal deterministic engine by default. To connect a live OpenAI or Anthropic model, supply an API key below. Keys are stored locally and never broadcasted.
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">AI Provider Engine</label>
              <select
                value={user.aiProvider}
                onChange={(e) => updateUser({ aiProvider: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              >
                <option value="mock_intelligent">Built-in Intelligent Engine (Offline/Deterministic)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4 Turbo via secure backend)</option>
                <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Optional LLM API Key</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Export & Reset */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-sky-400" /> Data Portability & Backup
        </h2>
        <p className="text-xs text-slate-400">
          You have full ownership of your data. Export your entire LifeOS knowledge vault as machine-readable JSON or tabular CSV.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-teal-400" /> Export Complete Backup (JSON)
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" /> Export Tasks (CSV)
          </button>
          <button
            onClick={resetAllDemoData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Demo State
          </button>
        </div>
      </div>
    </div>
  );
};
