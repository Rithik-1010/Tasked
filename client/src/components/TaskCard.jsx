import { motion } from 'framer-motion';
import { formatDate, isOverdue, getPriorityColor, getStatusColor } from '../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, selected, onSelect }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className={`glass rounded-2xl p-5 border-glow group transition-all duration-200 cursor-pointer ${
        selected ? 'ring-2 ring-[var(--color-accent)]/50' : ''
      }`}
      onClick={() => onEdit && onEdit(task)}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(task._id);
          }}
          className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
            selected
              ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
          }`}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title & Priority */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`font-semibold text-base truncate ${task.status === 'completed' ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
              {task.title}
            </h3>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
              title={`${task.priority} priority`}
            />
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">{task.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${getStatusColor(task.status)}20`,
                color: getStatusColor(task.status)
              }}
            >
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>

            {task.category && task.category !== 'General' && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1.5 ${overdue ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== 'completed' && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange && onStatusChange(task._id, 'completed'); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-green-400 hover:bg-green-400/10 transition-all"
              title="Complete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
