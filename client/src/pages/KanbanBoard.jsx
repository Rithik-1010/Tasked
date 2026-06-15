import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import api from '../services/api';
import TaskModal from '../components/TaskModal';
import { getStatusColor, formatDate, isOverdue, getPriorityColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const columns = [
  { id: 'pending', title: 'Pending', color: '#A1A1AA' },
  { id: 'in-progress', title: 'In Progress', color: '#C084FC' },
  { id: 'completed', title: 'Completed', color: '#34D399' }
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({ pending: [], 'in-progress': [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', { params: { limit: 100 } });
      const grouped = { pending: [], 'in-progress': [], completed: [] };
      res.data.tasks.forEach(t => {
        if (grouped[t.status]) grouped[t.status].push(t);
      });
      setTasks(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...tasks[destination.droppableId]];

    const [moved] = sourceCol.splice(source.index, 1);
    moved.status = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setTasks(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    }));

    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      if (destination.droppableId === 'completed') toast.success('Task completed!');
    } catch (err) {
      fetchTasks();
      toast.error('Failed to update');
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, data);
        toast.success('Updated!');
      } else {
        await api.post('/tasks', data);
        toast.success('Created!');
      }
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-grotesk font-bold tracking-tight">Board</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Drag and drop to update status</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white text-sm font-medium btn-shine glow-violet hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Task
          </button>
        </div>
      </motion.div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => (
            <div key={col.id} className="glass rounded-2xl p-4 border-glow min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-sm font-grotesk font-semibold">{col.title}</h3>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">{tasks[col.id]?.length || 0}</span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[300px] rounded-xl p-1 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-[var(--color-accent)]/5' : ''
                    }`}
                  >
                    {tasks[col.id]?.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`glass rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all ${
                              snapshot.isDragging ? 'glow-violet rotate-2 scale-105' : ''
                            }`}
                            onClick={() => { setEditingTask(task); setModalOpen(true); }}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getPriorityColor(task.priority) }} />
                              <h4 className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                                {task.title}
                              </h4>
                            </div>
                            {task.description && (
                              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2">
                              {task.category && task.category !== 'General' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{task.category}</span>
                              )}
                              {task.dueDate && (
                                <span className={`text-[10px] ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}>
                                  {formatDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        task={editingTask}
        loading={saving}
      />
    </div>
  );
};

export default KanbanBoard;
