import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useSocket } from '../context/SocketContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { TaskCardSkeleton } from '../components/Skeleton';
import { exportToCSV } from '../utils/helpers';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { tasks, loading, pagination, filters, fetchTasks, createTask, updateTask, deleteTask, bulkAction, updateFilters } = useTasks();
  const { socket } = useSocket();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const handleCreated = () => fetchTasks();
    const handleUpdated = () => fetchTasks();
    const handleDeleted = () => fetchTasks();
    const handleBulk = () => fetchTasks();
    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);
    socket.on('tasks:bulk-update', handleBulk);
    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
      socket.off('tasks:bulk-update', handleBulk);
    };
  }, [socket, fetchTasks]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await createTask(data);
      setModalOpen(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await updateTask(editingTask._id, data);
      setEditingTask(null);
      setModalOpen(false);
      toast.success('Task updated!');
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(deleteId);
      setDeleteId(null);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      toast.success(status === 'completed' ? 'Task completed!' : 'Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    try {
      await bulkAction(selectedIds, 'delete');
      setSelectedIds([]);
      toast.success(`${selectedIds.length} tasks deleted`);
    } catch (err) {
      toast.error('Bulk action failed');
    }
  };

  const handleBulkComplete = async () => {
    try {
      await bulkAction(selectedIds, 'update', { status: 'completed' });
      setSelectedIds([]);
      toast.success(`${selectedIds.length} tasks completed`);
    } catch (err) {
      toast.error('Bulk action failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-grotesk font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{pagination.total} total tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(tasks)}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-2)] transition-all"
          >
            Export CSV
          </button>
          <button
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white text-sm font-medium btn-shine glow-violet hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Task
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={filters.search}
              onChange={(e) => { updateFilters({ search: e.target.value }); }}
              onKeyDown={(e) => e.key === 'Enter' && fetchTasks()}
              placeholder="Search tasks..."
              className="w-full h-14 pl-12 pr-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)]/50 transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => { updateFilters({ status: e.target.value }); setTimeout(() => fetchTasks(), 0); }}
            className="h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)]/50 transition-all"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => { updateFilters({ priority: e.target.value }); setTimeout(() => fetchTasks(), 0); }}
            className="h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)]/50 transition-all"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Category filter */}
          <select
            value={filters.category}
            onChange={(e) => { updateFilters({ category: e.target.value }); setTimeout(() => fetchTasks(), 0); }}
            className="h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)]/50 transition-all"
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
            <option value="Finance">Finance</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => { updateFilters({ sort: e.target.value }); setTimeout(() => fetchTasks(), 0); }}
            className="h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)]/50 transition-all"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </motion.div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-sm text-[var(--color-text-muted)]">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button onClick={handleBulkComplete} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">
                Complete All
              </button>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                Delete All
              </button>
              <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-all">
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      <div className="space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => <TaskCardSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-[var(--color-text-muted)] opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <h3 className="text-lg font-grotesk font-semibold mb-1">No tasks found</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Create a new task or adjust your filters</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => { setEditingTask(t); setModalOpen(true); }}
                onDelete={(id) => setDeleteId(id)}
                onStatusChange={handleStatusChange}
                selected={selectedIds.includes(task._id)}
                onSelect={handleSelect}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchTasks({ page: i + 1 })}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                pagination.page === i + 1
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
        loading={saving}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default Tasks;
