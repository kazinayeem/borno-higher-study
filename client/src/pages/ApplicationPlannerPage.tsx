import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Trash2, FileCheck, Shield, Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'Documents' | 'Testing' | 'Application' | 'Visa' | 'Finance';
  dueDate: string;
  completed: boolean;
}

const DEFAULT_TASKS: Task[] = [
  { id: 't1', title: 'Collect official bachelor transcript & degree certificate', category: 'Documents', dueDate: '2025-04-15', completed: true },
  { id: 't2', title: 'Prepare Motivation Letter (Statement of Purpose)', category: 'Documents', dueDate: '2025-05-01', completed: true },
  { id: 't3', title: 'Obtain 2 academic recommendation letters from faculty', category: 'Documents', dueDate: '2025-05-10', completed: false },
  { id: 't4', title: 'Take IELTS Academic exam (Aiming 6.5+)', category: 'Testing', dueDate: '2025-05-20', completed: false },
  { id: 't5', title: 'Submit Joint Application on Studyinfo / University portal', category: 'Application', dueDate: '2025-06-01', completed: false },
  { id: 't6', title: 'Apply for Government / University Scholarship grant', category: 'Application', dueDate: '2025-06-15', completed: false },
  { id: 't7', title: 'Open student blocked account / Prepare 1-year bank solvent statement', category: 'Finance', dueDate: '2025-07-01', completed: false },
  { id: 't8', title: 'Book Embassy visa appointment and submit biometric data', category: 'Visa', dueDate: '2025-07-20', completed: false },
];

export const ApplicationPlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('borno_planner_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('Documents');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('borno_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
    setNewDueDate('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Progress */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Student Milestones & Timeline</span>
              </div>
              <h1 className="text-3xl font-extrabold text-brand-navy mt-1">
                Application Planner & Checklist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Stay on top of documentation, test dates, admissions deadlines, and visa requirements.
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-teal-600">{progressPercent}%</span>
              <span className="text-xs text-slate-400 block">Readiness Completed</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            <span>Total Tasks: {tasks.length}</span>
            <span>Completed: {completedCount}</span>
            <span>Pending: {tasks.length - completedCount}</span>
          </div>
        </div>

        {/* Add New Task Form */}
        <form
          onSubmit={handleAddTask}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new application milestone or task…"
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500 w-full"
            required
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
          >
            <option value="Documents">Documents</option>
            <option value="Testing">Testing</option>
            <option value="Application">Application</option>
            <option value="Finance">Finance</option>
            <option value="Visa">Visa</option>
          </select>

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
          />

          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Tasks Checklist */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card divide-y divide-slate-100 overflow-hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                task.completed ? 'bg-slate-50/60 opacity-80' : 'hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-teal-600 hover:scale-110 transition-transform shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-600 fill-teal-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                  )}
                </button>

                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {task.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
