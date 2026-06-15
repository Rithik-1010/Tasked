import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, loading = false }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        category: task.category || 'General',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
        notes: task.notes || ''
      });
    } else {
      reset({
        title: '', description: '', priority: 'medium', status: 'pending',
        category: 'General', dueDate: '', tags: '', notes: ''
      });
    }
  }, [task, reset, isOpen]);

  const handleFormSubmit = (data) => {
    const processed = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dueDate: data.dueDate || null
    };
    onSubmit(processed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg glass-strong rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ borderColor: 'rgba(192,132,252,0.2)', boxShadow: '0 0 60px rgba(192,132,252,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-grotesk font-bold">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-3)] transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Title</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-text-muted)]/50"
                  placeholder="What needs to be done?"
                />
                {errors.title && <span className="text-xs text-red-400 mt-1.5 block text-left">{errors.title.message}</span>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full p-5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all resize-none placeholder:text-[var(--color-text-muted)]/50"
                  placeholder="Add details..."
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Status</label>
                  <select
                    {...register('status')}
                    className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Category & Due Date */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Category</label>
                  <select
                    {...register('category')}
                    className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Due Date</label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Tags (comma separated)</label>
                <input
                  {...register('tags')}
                  className="w-full h-14 px-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-text-muted)]/50"
                  placeholder="design, frontend, urgent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="w-full p-5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all resize-none placeholder:text-[var(--color-text-muted)]/50"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 items-center justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-14 rounded-xl border border-[var(--color-border)] text-lg font-medium hover:bg-[var(--color-surface-2)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white text-lg font-medium btn-shine glow-violet hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </span>
                  ) : task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
