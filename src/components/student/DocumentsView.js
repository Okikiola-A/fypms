import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Eye, Download, X, Search, CheckCircle, AlertCircle, Clock, File, FileImage, Archive, Trash2, Plus } from 'lucide-react';

// File type → icon + colour
const getFileStyle = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext))          return { color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF' };
  if (['doc', 'docx'].includes(ext))  return { color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'DOC' };
  if (['ppt', 'pptx'].includes(ext))  return { color: 'text-orange-500', bg: 'bg-orange-50', label: 'PPT' };
  if (['xls', 'xlsx'].includes(ext))  return { color: 'text-green-500',  bg: 'bg-green-50',  label: 'XLS' };
  if (['png','jpg','jpeg','gif','webp'].includes(ext)) return { color: 'text-purple-500', bg: 'bg-purple-50', label: 'IMG' };
  if (['zip','rar','7z'].includes(ext)) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'ZIP' };
  return { color: 'text-gray-500', bg: 'bg-gray-100', label: ext.toUpperCase() || 'FILE' };
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const statusStyles = {
  'Approved':       'bg-green-100 text-green-800',
  'Pending Review': 'bg-yellow-100 text-yellow-800',
  'Needs Revision': 'bg-red-100 text-red-800',
  'Uploading':      'bg-blue-100 text-blue-800',
};

const statusIcons = {
  'Approved':       <CheckCircle size={12} />,
  'Pending Review': <Clock size={12} />,
  'Needs Revision': <AlertCircle size={12} />,
};

// Individual queued file row inside the upload panel
const QueuedFile = ({ file, onRemove, darkMode }) => {
  const style = getFileStyle(file.name);
  const pct = file.progress ?? 0;
  const done = file.status === 'done';
  const err  = file.status === 'error';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
        <span className={`text-xs font-bold ${style.color}`}>{style.label}</span>
      </div>

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{file.name}</p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatSize(file.size)}</p>
        {/* Progress bar */}
        {!done && !err && (
          <div className={`mt-1.5 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        {done && <p className="text-xs text-green-500 mt-0.5 font-medium">Upload complete</p>}
        {err  && <p className="text-xs text-red-400 mt-0.5">Upload failed — file too large</p>}
      </div>

      {/* Status / remove */}
      <div className="flex-shrink-0">
        {done ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : err ? (
          <AlertCircle size={18} className="text-red-400" />
        ) : (
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct}%</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className={`p-1 rounded-full transition-colors flex-shrink-0 ${
          darkMode ? 'hover:bg-gray-600 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
        }`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const DocumentsView = ({ documents: initialDocs, darkMode }) => {
  const [documents, setDocuments] = useState(initialDocs || []);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState([]);       // files staged/in-progress
  const [docType, setDocType] = useState('');   // selected document type
  const [note, setNote] = useState('');         // optional note
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);                // track nested drag events

  const MAX_MB = 10;
  const ACCEPTED = ['.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.png','.jpg','.jpeg','.zip'];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate upload progress for a single file
  const simulateUpload = useCallback((fileId) => {
    const totalSteps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const pct = Math.round((step / totalSteps) * 100);
      setQueue(prev => prev.map(f =>
        f.id === fileId ? { ...f, progress: pct } : f
      ));
      if (step >= totalSteps) {
        clearInterval(interval);
        setQueue(prev => prev.map(f =>
          f.id === fileId ? { ...f, progress: 100, status: 'done' } : f
        ));
      }
    }, 80);
  }, []);

  const addFiles = useCallback((rawFiles) => {
    const newEntries = [];
    Array.from(rawFiles).forEach(file => {
      const tooBig = file.size > MAX_MB * 1024 * 1024;
      const entry = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: tooBig ? 'error' : 'uploading',
      };
      newEntries.push(entry);
    });
    setQueue(prev => [...prev, ...newEntries]);
    // Start upload simulation for valid files
    newEntries.forEach(e => {
      if (e.status === 'uploading') simulateUpload(e.id);
    });
  }, [simulateUpload]);

  const handleFileInput = (e) => addFiles(e.target.files);

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFromQueue = (id) => setQueue(prev => prev.filter(f => f.id !== id));

  const doneFiles = queue.filter(f => f.status === 'done');
  const canSubmit = doneFiles.length > 0 && docType;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const today = new Date().toISOString().split('T')[0];
    const newDocs = doneFiles.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      uploadDate: today,
      status: 'Pending Review',
      feedback: null,
      note: note || null,
      docType,
    }));
    setDocuments(prev => [...newDocs, ...prev]);
    setQueue([]);
    setDocType('');
    setNote('');
    setShowUpload(false);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Documents</h3>
        <button
          onClick={() => setShowUpload(v => !v)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by name or status…"
          className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'
          }`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Upload Panel ── */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showUpload ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`rounded-2xl border shadow-sm p-6 space-y-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload Document</h4>
            <button onClick={() => { setShowUpload(false); setQueue([]); }} className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X size={18} />
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 select-none ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                : darkMode
                  ? 'border-gray-600 hover:border-indigo-500 hover:bg-gray-700/40'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED.join(',')}
              className="hidden"
              onChange={handleFileInput}
            />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
              isDragging ? 'bg-indigo-100' : darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Upload size={28} className={isDragging ? 'text-indigo-600' : darkMode ? 'text-gray-400' : 'text-gray-400'} />
            </div>
            {isDragging ? (
              <p className="text-indigo-600 font-semibold text-lg">Drop files here</p>
            ) : (
              <>
                <p className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Drag & drop files here, or <span className="text-indigo-500">browse</span>
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  PDF, DOC, DOCX, PPT, XLS, PNG, JPG, ZIP — max {MAX_MB}MB each
                </p>
              </>
            )}
          </div>

          {/* Queued files */}
          {queue.length > 0 && (
            <div className="space-y-2">
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Files ({queue.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {queue.map(f => (
                  <QueuedFile key={f.id} file={f} onRemove={removeFromQueue} darkMode={darkMode} />
                ))}
              </div>
            </div>
          )}

          {/* Document type + note */}
          {queue.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Document Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <option value="">Select type…</option>
                  <option>Project Proposal</option>
                  <option>Literature Review</option>
                  <option>Chapter Draft</option>
                  <option>Methodology</option>
                  <option>Final Report</option>
                  <option>Presentation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. First draft for review"
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {queue.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {doneFiles.length} of {queue.filter(f => f.status !== 'error').length} file{queue.length !== 1 ? 's' : ''} ready
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setQueue([])}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`px-5 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                    canSubmit
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md hover:scale-105'
                      : darkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit {doneFiles.length > 0 ? `(${doneFiles.length})` : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* ── Documents Table ── */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {filteredDocuments.length > 0 ? (
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <tr>
                {['Document', 'Type', 'Upload Date', 'Status', 'Feedback', 'Actions'].map(h => (
                  <th key={h} className={`text-left p-4 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map(doc => {
                const style = getFileStyle(doc.name);
                return (
                  <tr key={doc.id} className={`border-b transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                    {/* Document name + icon */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                          <span className={`text-xs font-bold ${style.color}`}>{style.label}</span>
                        </div>
                        <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{doc.name}</span>
                      </div>
                    </td>
                    {/* Type */}
                    <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {doc.docType || '—'}
                    </td>
                    {/* Date */}
                    <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.uploadDate}</td>
                    {/* Status badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusIcons[doc.status]}
                        {doc.status}
                      </span>
                    </td>
                    {/* Feedback */}
                    <td className={`p-4 text-sm max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {doc.feedback
                        ? <span title={doc.feedback} className="line-clamp-1">{doc.feedback}</span>
                        : <span className={`italic ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>No feedback yet</span>}
                    </td>
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <button title="Preview" className={`p-2 rounded-lg transition-all hover:scale-110 ${darkMode ? 'text-indigo-400 hover:bg-indigo-900/30' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                          <Eye size={16} />
                        </button>
                        <button title="Download" className={`p-2 rounded-lg transition-all hover:scale-110 ${darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-50'}`}>
                          <Download size={16} />
                        </button>
                        <button title="Delete" onClick={() => deleteDocument(doc.id)} className={`p-2 rounded-lg transition-all hover:scale-110 ${darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-400 hover:bg-red-50'}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <FileText size={28} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowUpload(true)}
                className="mt-4 text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
              >
                Upload your first document →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsView;