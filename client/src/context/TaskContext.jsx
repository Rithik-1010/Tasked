import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '', sort: 'newest' });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      Object.keys(queryParams).forEach(k => { if (!queryParams[k]) delete queryParams[k]; });
      const res = await api.get('/tasks', { params: queryParams });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (data) => {
    const res = await api.post('/tasks', data);
    setTasks(prev => [res.data.task, ...prev]);
    return res.data.task;
  };

  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
    return res.data.task;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const bulkAction = async (taskIds, action, data) => {
    await api.post('/tasks/bulk', { taskIds, action, data });
    await fetchTasks();
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider value={{
      tasks, setTasks, pagination, loading, filters, fetchTasks,
      createTask, updateTask, deleteTask, bulkAction, updateFilters
    }}>
      {children}
    </TaskContext.Provider>
  );
};
