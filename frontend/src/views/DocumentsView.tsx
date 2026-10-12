import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Download,
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    deleteDocument,
    simulateAiScan,
    openQuickAdd
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc => {
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCat !== 'all' && doc.category !== selectedCat) return false;
    return true;
  });

  const handleDownload = (docTitle: string) => {
    setDownloadSuccessMsg(`Generated time-limited signed URL for "${docTitle}". Download simulated.`);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderLock className="w-6 h-6 text-purple-400" /> Private Document Vault
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Encrypted personal records, identity documents, and AI metadata extraction.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('document')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* Security & Access Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Zero-Knowledge Privacy:</strong> Stored documents are strictly private to you. No public URLs or unauthenticated third-party AI exposure without explicit consent.
        </span>
      </div>

      {downloadSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
          {downloadSuccessMsg}
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vault documents by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['all', 'identity', 'personal', 'education', 'medical', 'bills', 'insurance'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors
                ${selectedCat === cat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-500 text-sm">
            No documents in this category. Click "Add Document" to store one.
          </div>
        ) : (
          filteredDocs.map(doc => {
            const isExpiringSoon = doc.expiryDate && new Date(doc.expiryDate).getTime() - Date.now() < 86400000 * 60;
            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{doc.title}</h3>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {doc.category} • {(doc.fileSizeKb / 1024).toFixed(1)} MB • {doc.fileType.split('/')[1] || 'PDF'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 uppercase flex-shrink-0">
                    Vault Private
                  </span>
                </div>

                {doc.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{doc.description}</p>
                )}

                {/* AI Extracted Summary pill */}
                {doc.aiExtractedSummary && (
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300">
                    <span className="font-bold flex items-center gap-1 text-purple-400 mb-0.5">
                      <Sparkles className="w-3 h-3" /> AI Extracted Metadata
                    </span>
                    {doc.aiExtractedSummary}
                  </div>
                )}

                {/* Expiry Warning */}
                {isExpiringSoon && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Expires soon on {doc.expiryDate}</span>
                  </div>
                )}

                {/* Footer and Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Uploaded: {doc.uploadedAt ? doc.uploadedAt.split('T')[0] : 'Recent'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => simulateAiScan(doc.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
                      title="Run simulated AI metadata extractor"
                    >
                      <Sparkles className="w-3 h-3" /> AI Scan
                    </button>

                    <button
                      onClick={() => handleDownload(doc.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Download with signed token"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
