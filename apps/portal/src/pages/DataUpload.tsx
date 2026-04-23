import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:3000/api';

type ImportType = 'users' | 'roles';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const IMPORT_TYPES: { value: ImportType; label: string; desc: string; columns: string[] }[] = [
  { value: 'users', label: 'GRC Users', desc: 'Upload user catalog from SAP, Oracle or any HR system.', columns: ['user_code', 'full_name', 'email', 'source_system', 'status'] },
  { value: 'roles', label: 'GRC Roles', desc: 'Upload role definitions with process area and criticality.', columns: ['role_name', 'process_area', 'criticality', 'role_desc'] },
];

export const DataUpload = () => {
  const [importType, setImportType] = useState<ImportType>('users');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [result, setResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedConfig = IMPORT_TYPES.find(t => t.value === importType)!;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/data-upload/${importType}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      setResult({ message_text: err.message });
      setStatus('error');
    }
  };

  const reset = () => { setFile(null); setStatus('idle'); setResult(null); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Data Upload</h1>
        <p className="text-slate-500 text-sm mt-1">Import bulk GRC records from CSV or Excel files.</p>
      </div>

      {/* Step 1: Select Type */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-4">① Select Import Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMPORT_TYPES.map(type => (
            <button key={type.value} onClick={() => { setImportType(type.value); reset(); }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${importType === type.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
              <p className={`font-semibold text-sm ${importType === type.value ? 'text-blue-700' : 'text-slate-700'}`}>{type.label}</p>
              <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Template Download */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-3">② Required Columns</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedConfig.columns.map(col => (
            <span key={col} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded-md border border-slate-200">{col}</span>
          ))}
        </div>
        <p className="text-xs text-slate-400">Make sure your CSV or XLSX file has these exact column headers in the first row.</p>
      </div>

      {/* Step 3: Drop Zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-4">③ Upload File</p>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${dragging ? 'border-blue-400 bg-blue-50' : file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
        >
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setStatus('idle'); }}} />
          {file ? (
            <>
              <FileText className="w-10 h-10 text-emerald-500 mb-3" />
              <p className="font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">Drag & drop or click to select</p>
              <p className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx, .xls</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={handleUpload} disabled={!file || status === 'uploading'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {status === 'uploading' ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
            ) : (
              <><Download className="w-4 h-4" /> Import Data</>
            )}
          </button>
          {file && <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors">Clear</button>}
        </div>
      </div>

      {/* Step 4: Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`bg-white rounded-xl border p-6 shadow-sm ${status === 'success' ? 'border-emerald-200' : 'border-rose-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              {status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
              <p className={`font-semibold text-sm ${status === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {status === 'success' ? `Import ${result.result_status}` : 'Import Failed'}
              </p>
            </div>
            {status === 'success' && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Total Rows', value: result.total_rows, icon: FileText, color: 'text-slate-600' },
                  { label: 'Successful', value: result.ok_rows, icon: CheckCircle2, color: 'text-emerald-600' },
                  { label: 'Errors', value: result.error_rows, icon: AlertCircle, color: 'text-rose-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                    <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
            {result.message_text && (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">{result.message_text}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
