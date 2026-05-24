import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiFolder, FiMoreVertical, FiCalendar } from 'react-icons/fi';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description, deadline });
      setShowModal(false);
      setName(''); setDescription(''); setDeadline('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse font-medium">Loading Projects...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight">Projects</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Manage and view all your workspaces</p>
        </motion.div>
        {user.role === 'Admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] font-bold text-sm transition-all"
          >
            <FiPlus className="mr-2 h-5 w-5" /> New Project
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={project._id} 
            className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
          >
            <Link to={`/projects/${project._id}`} className="block">
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 text-primary-400 rounded-xl border border-primary-500/20 shadow-inner group-hover:scale-110 transition-transform">
                    <FiFolder className="w-6 h-6" />
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-auto">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                    project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex items-center">
                    <FiCalendar className="mr-1.5" />
                    {moment(project.deadline).format('MMM Do, YY')}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-24 glass-panel rounded-2xl border border-dashed border-white/20">
          <FiFolder className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-300">No projects active</h3>
          <p className="mt-2 text-sm text-gray-500 font-medium">Get started by creating a new workspace.</p>
        </div>
      )}

      {/* Modern Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel bg-surface border border-border rounded-3xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-indigo-500"></div>
              
              <h3 className="text-2xl font-black text-white mb-6">Initialize Project</h3>
              
              <form onSubmit={handleCreateProject} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Project Name</label>
                  <input
                    type="text" required
                    className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Website Redesign"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    required rows={3}
                    className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                    value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project about?"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Deadline</label>
                  <input
                    type="date" required
                    className="mt-1.5 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    Launch Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
