import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Layers,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  getCareerResearchRecords,
  getCVExamples,
  getCareerGuides,
  adminCreateResearchRecord,
  adminUpdateResearchRecord,
  adminDeleteResearchRecord
} from '../../services/api';
import { CVResearchRecordItem, CVExampleItem, CareerGuideItem } from '../../types/index';

export const AdminCareerToolkitManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RESEARCH' | 'EXAMPLES' | 'GUIDES'>('RESEARCH');
  
  // Research records state
  const [records, setRecords] = useState<CVResearchRecordItem[]>([]);
  const [examples, setExamples] = useState<CVExampleItem[]>([]);
  const [guides, setGuides] = useState<CareerGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Modal State for adding/editing record
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [currentRecord, setCurrentRecord] = useState<Partial<CVResearchRecordItem>>({
    sourceInstitution: '',
    sourceUrl: '',
    title: '',
    cvType: 'ACADEMIC_CV',
    intendedAudience: '',
    field: '',
    careerStage: 'Undergraduate',
    formattingObservations: '',
    usefulPractices: '',
    potentialLimitations: '',
    dateAccessed: '2026-10-17',
    verificationStatus: 'VERIFIED'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [recRes, exRes, gRes] = await Promise.all([
        getCareerResearchRecords(),
        getCVExamples(),
        getCareerGuides()
      ]);
      setRecords(recRes.records || []);
      setExamples(exRes.examples || []);
      setGuides(gRes.guides || []);
    } catch (e) {
      console.error('Failed to load admin career data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('CREATE');
    setCurrentRecord({
      sourceInstitution: '',
      sourceUrl: '',
      title: '',
      cvType: 'ACADEMIC_CV',
      intendedAudience: '',
      field: '',
      careerStage: 'Undergraduate',
      sectionStructure: ['Education', 'Experience', 'Skills'],
      formattingObservations: '',
      usefulPractices: '',
      potentialLimitations: '',
      dateAccessed: '2026-10-17',
      verificationStatus: 'VERIFIED'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rec: CVResearchRecordItem) => {
    setModalMode('EDIT');
    setCurrentRecord({ ...rec });
    setIsModalOpen(true);
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'CREATE') {
        await adminCreateResearchRecord(currentRecord);
      } else if (currentRecord.id) {
        await adminUpdateResearchRecord(currentRecord.id, currentRecord);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert('Failed to save research record.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this verified research record?')) {
      try {
        await adminDeleteResearchRecord(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete record.');
      }
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.sourceInstitution.toLowerCase().includes(search.toLowerCase()) ||
      r.field.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || r.cvType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Stats */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Career Toolkit Control Center
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Super Admin Career Document & Research Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage 52 verified university records, 12 illustrative CV models, and 8 editorial guides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified Record</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Refresh dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                {records.length}
              </div>
              <div className="text-xs text-slate-500">Verified Research Records</div>
            </div>
            <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                {examples.length}
              </div>
              <div className="text-xs text-slate-500">Sample CV Models</div>
            </div>
            <Layers className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                {guides.length}
              </div>
              <div className="text-xs text-slate-500">Published Editorial Guides</div>
            </div>
            <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('RESEARCH')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'RESEARCH'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Research Records Archive ({records.length})
        </button>
        <button
          onClick={() => setActiveTab('EXAMPLES')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'EXAMPLES'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Illustrative CV Models ({examples.length})
        </button>
        <button
          onClick={() => setActiveTab('GUIDES')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'GUIDES'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Editorial Guides ({guides.length})
        </button>
      </div>

      {/* Tab 1: Research Records Table */}
      {activeTab === 'RESEARCH' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search institution, title or field..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-64"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="ALL">All CV Types</option>
                <option value="ACADEMIC_CV">Academic CV</option>
                <option value="EUROPASS_CV">Europass CV</option>
                <option value="STUDENT_RESUME">Student Resume</option>
                <option value="RESEARCH_CV">Research CV</option>
                <option value="SCHOLARSHIP_CV">Scholarship CV</option>
              </select>
            </div>
            <div className="text-xs text-slate-500">
              Showing {filteredRecords.length} of {records.length}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[640px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Institution / Publisher</th>
                  <th className="py-3 px-4">Title & Intended Audience</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{r.sourceInstitution}</div>
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{r.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{r.intendedAudience}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300">
                        {r.cvType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {r.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Examples */}
      {activeTab === 'EXAMPLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examples.map((ex) => (
            <div
              key={ex.slug}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 mb-2 inline-block">
                  {ex.careerStage}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {ex.title}
                </h4>
                <p className="text-xs text-slate-500 mb-2">{ex.targetAudience}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {ex.rationaleEn}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] text-amber-600 font-bold">Illustrative Model</span>
                <a
                  href={`/career-toolkit/cv-examples`}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View in Directory
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Guides */}
      {activeTab === 'GUIDES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((g) => (
            <div
              key={g.slug}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 mb-2 inline-block">
                  {g.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                  {g.titleEn}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {g.summaryEn}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{g.lastReviewed}</span>
                <a
                  href={`/career-toolkit/${g.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-600 hover:underline"
                >
                  Open Guide
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating / Editing Research Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {modalMode === 'CREATE' ? 'Add Verified Public CV Research Record' : 'Edit Research Record'}
            </h3>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Source Institution / University</label>
                <input
                  type="text"
                  required
                  value={currentRecord.sourceInstitution || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, sourceInstitution: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Original Source URL</label>
                <input
                  type="url"
                  required
                  value={currentRecord.sourceUrl || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, sourceUrl: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={currentRecord.title || ''}
                    onChange={(e) => setCurrentRecord({ ...currentRecord, title: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">CV Type</label>
                  <select
                    value={currentRecord.cvType || 'ACADEMIC_CV'}
                    onChange={(e) => setCurrentRecord({ ...currentRecord, cvType: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="ACADEMIC_CV">Academic CV</option>
                    <option value="EUROPASS_CV">Europass CV</option>
                    <option value="STUDENT_RESUME">Student Resume</option>
                    <option value="RESEARCH_CV">Research CV</option>
                    <option value="SCHOLARSHIP_CV">Scholarship CV</option>
                    <option value="GRADUATE_CV">Graduate Application CV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Intended Audience</label>
                <input
                  type="text"
                  value={currentRecord.intendedAudience || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, intendedAudience: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Useful Practices Observed</label>
                <textarea
                  rows={2}
                  value={currentRecord.usefulPractices || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, usefulPractices: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Potential Limitations</label>
                <textarea
                  rows={2}
                  value={currentRecord.potentialLimitations || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, potentialLimitations: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
