import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import {
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowLeft,
  Search,
  ExternalLink,
} from 'lucide-react';

const SAMPLE_CSV = `name,country,city,tuition
Aalto University,Finland,Espoo,15000
University of Helsinki,Finland,Helsinki,13000
Technical University of Munich,Germany,Munich,6000
RWTH Aachen University,Germany,Aachen,350
Lund University,Sweden,Lund,145000`;

export const AdminVerificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'csv' | 'records'>('csv');
  const [rawCsv, setRawCsv] = useState(SAMPLE_CSV);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [previewStats, setPreviewStats] = useState<{ total: number; ready: number; duplicates: number } | null>(null);

  const [universities, setUniversities] = useState(UNIVERSITIES_DATA);
  const [search, setSearch] = useState('');

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = rawCsv.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim()));

    const preview = rows.map((cols, idx) => {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowObj[h] = cols[i] || '';
      });

      const isDuplicate = universities.some(
        (u) => u.name.toLowerCase() === (rowObj['name'] || '').toLowerCase()
      );

      return {
        rowIndex: idx + 1,
        name: rowObj['name'] || 'Unknown',
        country: rowObj['country'] || '',
        city: rowObj['city'] || '',
        tuition: rowObj['tuition'] || '',
        isDuplicate,
        status: isDuplicate ? 'DUPLICATE_DETECTED' : 'READY_TO_IMPORT',
      };
    });

    setCsvPreview(preview);
    setPreviewStats({
      total: preview.length,
      ready: preview.filter((p) => p.status === 'READY_TO_IMPORT').length,
      duplicates: preview.filter((p) => p.status === 'DUPLICATE_DETECTED').length,
    });
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setUniversities((prev) =>
      prev.map((u) => (u.id === id ? { ...u, verificationStatus: newStatus } : u))
    );
  };

  const filteredUnis = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.countryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy">
              Data Verification & Import Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Preview bulk institutional datasets from CSV/APIs, detect duplicate entities, and update verification flags.
            </p>
          </div>

          <div className="flex border border-slate-200 bg-white rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'csv' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              CSV Data Ingestion
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'records' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              Review Verification Queue ({universities.length})
            </button>
          </div>
        </div>

        {/* TAB 1: CSV Ingestion & Duplicate Detection */}
        {activeTab === 'csv' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <h3 className="font-extrabold text-lg text-brand-navy flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                Raw CSV Import & Pre-flight Validation
              </h3>
              <p className="text-xs text-slate-500">
                Paste structured CSV rows below. The pipeline automatically evaluates duplicate institutions against existing PostgreSQL records before publishing.
              </p>

              <form onSubmit={handlePreview} className="space-y-4">
                <textarea
                  rows={6}
                  value={rawCsv}
                  onChange={(e) => setRawCsv(e.target.value)}
                  className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Expected headers: name, country, city, tuition
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Run Pre-Flight Validation</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Results Table */}
            {previewStats && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base text-brand-navy">
                      Import Validation Preview ({previewStats.total} Records)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Found {previewStats.ready} new universities ready for ingestion, {previewStats.duplicates} existing duplicates flagged.
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Successfully imported ${previewStats.ready} records to verified database.`)}
                    className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition-colors"
                  >
                    Commit {previewStats.ready} New Records
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">University Name</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Tuition</th>
                        <th className="p-4">Validation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreview.map((row) => (
                        <tr key={row.rowIndex} className="hover:bg-slate-50/60">
                          <td className="p-4 text-slate-400">{row.rowIndex}</td>
                          <td className="p-4 font-bold text-slate-800">{row.name}</td>
                          <td className="p-4 text-slate-600">{row.country}</td>
                          <td className="p-4 text-slate-600">{row.city}</td>
                          <td className="p-4 font-semibold text-teal-700">{row.tuition}</td>
                          <td className="p-4">
                            {row.isDuplicate ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Duplicate Found (Skipped)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Ready to Import
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Verification Queue */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by university or country…"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                />
              </div>

              <span className="text-xs text-slate-500">
                Total in catalog: <strong>{universities.length}</strong>
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">University</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Official Admissions URL</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUnis.map((uni) => (
                    <tr key={uni.id} className="hover:bg-slate-50/60">
                      <td className="p-4">
                        <strong className="text-slate-800 text-sm block">{uni.name}</strong>
                        <span className="text-[11px] text-slate-400">
                          {uni.programs.length} Verified Programs
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {uni.cityName}, {uni.countryName}
                      </td>
                      <td className="p-4">
                        <a
                          href={uni.admissionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Admissions Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            uni.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {uni.verificationStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={uni.verificationStatus}
                          onChange={(e) => handleStatusChange(uni.id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="NEEDS_UPDATE">NEEDS_UPDATE</option>
                          <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
