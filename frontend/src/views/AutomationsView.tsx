import React, { useState } from 'react';
import {
  Zap,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  History,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApprovalRequest, ApprovalRiskLevel } from '../types';

export const AutomationsView: React.FC = () => {
  const {
    automations,
    toggleAutomation,
    runAutomationNow,
    approvals,
    respondApproval,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rules' | 'approvals' | 'audit'>('rules');
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');

  const getRiskBadge = (risk: ApprovalRiskLevel) => {
    switch (risk) {
      case 'READ_ONLY':
        return 'bg-teal-500/20 text-teal-400 border border-teal-500/30';
      case 'INTERNAL_REVERSIBLE':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
      case 'EXTERNAL':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'SENSITIVE_FINANCIAL':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-400" /> Automation & Approval Gates
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Controlled background execution with mandatory human verification on sensitive actions.
          </p>
        </div>

        {pendingApprovals.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{pendingApprovals.length} Approval Required</span>
          </div>
        )}
      </div>

      {/* Safety Gate Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Strict Safety Protocol:</strong> External service writes, third-party communications, and financial modifications strictly require explicit human authorization before execution.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors
            ${activeTab === 'rules'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <Zap className="w-4 h-4" /> Active Recipes ({automations.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors
            ${activeTab === 'approvals'
              ? 'border-rose-400 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <FileCheck className="w-4 h-4" /> Pending Approvals ({pendingApprovals.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors
            ${activeTab === 'audit'
              ? 'border-teal-400 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <History className="w-4 h-4" /> Audit Verification Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Automation Recipes */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {automations.map(rule => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-colors space-y-3
                ${rule.isEnabled
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{rule.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase
                      ${rule.isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {rule.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    {rule.requiresApproval && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Gate: Human Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{rule.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => runAutomationNow(rule.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Test run this automation immediately"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-400" /> Run Now
                  </button>

                  <button
                    onClick={() => toggleAutomation(rule.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1
                      ${rule.isEnabled ? 'bg-teal-500' : 'bg-slate-800'}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform
                        ${rule.isEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Execution details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 font-bold block">TRIGGER:</span>
                  <span className="text-slate-300">{rule.trigger}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">CONDITION:</span>
                  <span className="text-slate-300">{rule.condition}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">PROPOSED ACTION:</span>
                  <span className="text-slate-300">{rule.proposedAction}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Executed {rule.executionCount} times</span>
                <span>Last run: {rule.lastRun || 'Never'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Pending Approval Gates */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="rounded-2xl p-12 bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto mb-2 opacity-80" />
              All action approval queues are clear. No pending gates requiring review.
            </div>
          ) : (
            pendingApprovals.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getRiskBadge(req.riskLevel)}`}>
                        Risk: {req.riskLevel.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">Requested {req.requestedAt.split('T')[0]}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{req.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  {req.description}
                </p>

                {/* Safety Disclosures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 font-bold block">SERVICE AFFECTED:</span>
                    <span className="text-slate-200">{req.serviceAffected}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">ACTION REVERSIBILITY:</span>
                    <span className={req.isReversible ? 'text-teal-400' : 'text-rose-400'}>
                      {req.isReversible ? 'Reversible (Safe undo supported)' : 'Permanent / External change'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-bold block">PROPOSED PAYLOAD:</span>
                    <span className="text-slate-200 font-mono text-[11px]">{req.payloadSummary}</span>
                  </div>
                </div>

                {/* Decision controls */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Optional reviewer notes or feedback..."
                    value={rejectReason[req.id] || ''}
                    onChange={(e) => setRejectReason({ ...rejectReason, [req.id]: e.target.value })}
                    className="w-full sm:w-72 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => respondApproval(req.id, 'REJECTED', rejectReason[req.id])}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Action
                    </button>
                    <button
                      onClick={() => respondApproval(req.id, 'APPROVED', rejectReason[req.id])}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Execute
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: System Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-300">{log.actor}</td>
                    <td className="py-2.5 px-3 text-teal-400">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{log.resource}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold
                        ${log.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                          log.status === 'PROPOSED' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-300'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
