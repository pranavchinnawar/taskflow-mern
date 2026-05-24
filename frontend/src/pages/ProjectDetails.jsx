import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiClock, FiCheckSquare } from 'react-icons/fi';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({ Todo: [], 'In Progress': [], Done: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'Medium', dueDate: '', assignedUser: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`)
      ]);
      
      setProject(projectRes.data);
      
      const organizedTasks = { Todo: [], 'In Progress': [], Done: [] };
      const projectTasks = tasksRes.data.filter(t => t.project?._id === id || t.project === id);
      
      projectTasks.forEach(task => {
        if (organizedTasks[task.status]) organizedTasks[task.status].push(task);
        else organizedTasks['Todo'].push(task);
      });
      
      setTasks(organizedTasks);

      if (user.role === 'Admin') {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id, user.role]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '', assignedUser: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleDragStart = (e, taskId, sourceStatus) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceStatus', sourceStatus);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');

    if (sourceStatus === targetStatus) return;

    const taskToMove = tasks[sourceStatus].find(t => t._id === taskId);
    if (!taskToMove) return;

    if (user.role !== 'Admin' && taskToMove.assignedUser?._id !== user._id) {
       alert("You can only move your own tasks."); return;
    }

    setTasks(prev => {
      const newSource = prev[sourceStatus].filter(t => t._id !== taskId);
      const newTarget = [...prev[targetStatus], { ...taskToMove, status: targetStatus }];
      return { ...prev, [sourceStatus]: newSource, [targetStatus]: newTarget };
    });

    try {
      await api.put(`/tasks/${taskId}`, { status: targetStatus });
    } catch (error) {
      console.error('Failed to update task', error);
      fetchData();
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse font-medium">Loading Board...</div>;
  if (!project) return <div className="text-center py-20 text-red-400 font-medium">Project not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <FiCheckSquare className="mr-1.5" /> Workspace
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{project.name}</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium max-w-2xl">{project.description}</p>
        </motion.div>
        {user.role === 'Admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskModal(true)}
            className="flex items-center px-5 py-2.5 bg-white text-surface rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] font-bold text-sm transition-all"
          >
            <FiPlus className="mr-2 h-5 w-5" /> New Issue
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full">
          {['Todo', 'In Progress', 'Done'].map((status, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={status}
              className="w-80 flex flex-col bg-surface/50 border border-border rounded-2xl max-h-full backdrop-blur-md"
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
            >
              <div className="p-4 flex justify-between items-center border-b border-border">
                <h3 className="font-bold text-gray-300 flex items-center text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2.5 ${
                    status === 'Todo' ? 'bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.8)]' :
                    status === 'In Progress' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  }`} />
                  {status}
                </h3>
                <span className="bg-white/5 border border-white/10 text-gray-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
                  {tasks[status].length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] custom-scrollbar">
                {tasks[status].map(task => (
                  <motion.div
                    layoutId={task._id}
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id, status)}
                    className="bg-surface p-4 rounded-xl shadow-lg border border-white/5 cursor-grab active:cursor-grabbing hover:border-white/10 hover:bg-white/5 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                        task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-100 mb-1 leading-snug">{task.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-medium">{task.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <div className="flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        <FiClock className="mr-1.5" />
                        {moment(task.dueDate).format('MMM D')}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.assignedUser && (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm" title={task.assignedUser.name}>
                            {task.assignedUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg glass-panel bg-surface border border-border rounded-3xl shadow-2xl p-8 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
              <h3 className="text-2xl font-black text-white mb-6">New Issue</h3>
              
              <form onSubmit={handleCreateTask} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Issue Title</label>
                  <input type="text" required className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50" value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} placeholder="e.g. Fix authentication bug" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                  <textarea required rows={3} className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none" value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})} placeholder="Add more details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Priority</label>
                    <select className="mt-1.5 w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}>
                      <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Due Date</label>
                    <input type="date" required className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" value={taskForm.dueDate} onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Assignee</label>
                  <select required className="mt-1.5 w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" value={taskForm.assignedUser} onChange={(e) => setTaskForm({...taskForm, assignedUser: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">Create Issue</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
