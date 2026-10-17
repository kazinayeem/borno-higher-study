import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { useAuth } from '../context/AuthContext.js';
import { WorkspaceItem } from '../types/index.js';
import {
  Users,
  Plus,
  Mail,
  Shield,
  UserPlus,
  ArrowRight,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export const WorkspacesPage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Workspace state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Invite modal state
  const [activeWsForInvite, setActiveWsForInvite] = useState<WorkspaceItem | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const fetchWorkspaces = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/workspaces/my-workspaces', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load workspaces');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.workspaces || [];
        setWorkspaces(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    }
  }, [isAuthenticated, token]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newWsName,
          description: newWsDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create workspace');

      setShowCreateModal(false);
      setNewWsName('');
      setNewWsDesc('');
      fetchWorkspaces();
    } catch (err) {
      alert('Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWsForInvite || !inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const res = await fetch(`/api/workspaces/${activeWsForInvite.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invitation failed');

      setInviteSuccess(`Invitation sent to ${inviteEmail} with ${inviteRole} permissions.`);
      setInviteEmail('');
      fetchWorkspaces();
    } catch (err: any) {
      setInviteError(err.message || 'Invitation failed');
    } finally {
      setInviting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Study Circles & Workspaces</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Collaborate on international university applications, course roadmaps, and document checklists
            with fellow students without ever sharing account passwords.
          </p>
          <div className="mt-6">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Sign In to Access Workspaces
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SeoHead
        title="Student Study Workspaces & Circles | Borno Higher Study"
        description="Collaborate in secure peer study circles. Shared university wishlists, deadline trackers, and admission checklists with individual account security."
        canonicalPath="/workspaces"
      />

      <div className="bg-slate-900 text-white pt-8 pb-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Student Dashboard', href: '/dashboard' },
              { label: 'Study Workspaces' },
            ]}
          />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Multi-User Collaboration Without Password Sharing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Study Circles & Workspaces
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Study Circle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Security / Principle Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-950 leading-relaxed mb-8 flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-teal-900 uppercase tracking-wider text-[11px] mb-1">
              Zero-Password Sharing Architecture
            </h2>
            <p>
              Each student signs in with their own individual credentials. Workspace owners can grant
              <strong> Editor</strong> or <strong>Viewer</strong> access to peers, preserving full audit
              accountability for every change while safeguarding private student data.
            </p>
          </div>
        </div>

        {/* Workspaces List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading workspaces...</div>
        ) : workspaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No active study workspaces</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create a shared circle to collaborate with study partners applying to the same universities or intakes.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                      Study Workspace
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Created {new Date(ws.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{ws.name}</h3>
                  {ws.description && (
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{ws.description}</p>
                  )}

                  {/* Members list */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      Active Collaborators ({ws.members?.length || 1})
                    </p>
                    <div className="space-y-2">
                      {ws.members?.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                              {m.user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-slate-800 font-medium">{m.user?.name}</span>
                            <span className="text-[11px] text-slate-400">({m.user?.email})</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              m.role === 'OWNER'
                                ? 'bg-amber-100 text-amber-800'
                                : m.role === 'EDITOR'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWsForInvite(ws);
                      setInviteSuccess(null);
                      setInviteError(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Invite Peer Student
                  </button>

                  <Link
                    to="/universities"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <span>Browse Programs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Study Workspace</h3>
            <p className="text-xs text-slate-500 mb-4">
              Organize your joint university research, scholarship applications, and course checklists.
            </p>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ireland Fall 2027 Masters Applicants"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Focus Area
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tracking Computer Science program deadlines at UCD, TU Dublin & DBS..."
                  value={newWsDesc}
                  onChange={(e) => setNewWsDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {activeWsForInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Invite Peer to "{activeWsForInvite.name}"
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Invited students receive their own access via their email without sharing your account password.
            </p>

            {inviteSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{inviteSuccess}</span>
              </div>
            )}

            {inviteError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peer Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Permission Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'EDITOR' | 'VIEWER')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white text-slate-900"
                >
                  <option value="EDITOR">Editor (Can add notes, bookmarks, checklist items)</option>
                  <option value="VIEWER">Viewer (Read-only access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveWsForInvite(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Done
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg disabled:opacity-60"
                >
                  {inviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkspacesPage;
