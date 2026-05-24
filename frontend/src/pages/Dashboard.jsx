import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiList, FiUsers, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import moment from 'moment';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-40 ${colorClass.bg}`} />
    
    <div className="flex items-center space-x-5 relative z-10">
      <div className={`p-4 rounded-xl backdrop-blur-md shadow-inner border border-white/10 ${colorClass.bg} ${colorClass.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-4xl font-black text-white leading-none">{value}</h3>
          <span className="text-xs font-medium text-green-400 flex items-center mb-1">
            <FiTrendingUp className="mr-1" /> +12%
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0, inProgressTasks: 0, totalUsers: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const tasksRes = await api.get('/tasks');
        const tasks = tasksRes.data;
        let projects = [], users = [];

        if (user.role === 'Admin') {
          const [projectsRes, usersRes] = await Promise.all([api.get('/projects'), api.get('/users')]);
          projects = projectsRes.data;
          users = usersRes.data;
        }

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Done').length,
          inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
          pendingTasks: tasks.filter(t => t.status === 'Todo').length,
          totalUsers: users.length,
        });

        setRecentTasks(tasks.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.role]);

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse font-medium">Loading Workspace...</div>;

  const adminCards = [
    { title: "Total Projects", value: stats.totalProjects, icon: FiBriefcase, colorClass: { bg: 'bg-primary-500/20', text: 'text-primary-400' } },
    { title: "Total Tasks", value: stats.totalTasks, icon: FiList, colorClass: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' } },
    { title: "Completed", value: stats.completedTasks, icon: FiCheckCircle, colorClass: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' } },
    { title: "In Progress", value: stats.inProgressTasks, icon: FiClock, colorClass: { bg: 'bg-amber-500/20', text: 'text-amber-400' } },
    { title: "Pending", value: stats.pendingTasks, icon: FiList, colorClass: { bg: 'bg-gray-500/20', text: 'text-gray-400' } },
    { title: "Total Users", value: stats.totalUsers, icon: FiUsers, colorClass: { bg: 'bg-purple-500/20', text: 'text-purple-400' } },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Here's what's happening today, {moment().format('MMMM Do YYYY')}.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {user.role === 'Admin' ? (
          adminCards.map((card, i) => <StatCard key={card.title} {...card} delay={i * 0.1} />)
        ) : (
          <>
            <StatCard title="My Assigned Tasks" value={stats.totalTasks} icon={FiList} colorClass={{ bg: 'bg-primary-500/20', text: 'text-primary-400' }} delay={0} />
            <StatCard title="Completed" value={stats.completedTasks} icon={FiCheckCircle} colorClass={{ bg: 'bg-emerald-500/20', text: 'text-emerald-400' }} delay={0.1} />
            <StatCard title="Pending / Active" value={stats.pendingTasks + stats.inProgressTasks} icon={FiClock} colorClass={{ bg: 'bg-amber-500/20', text: 'text-amber-400' }} delay={0.2} />
          </>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl overflow-hidden border border-white/5"
      >
        <div className="px-8 py-6 border-b border-white/5 bg-surface/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white tracking-wide">Recent Activity</h3>
        </div>
        <div className="divide-y divide-white/5">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div key={task._id} className="px-8 py-5 hover:bg-white/5 transition-colors flex items-center justify-between group">
                <div>
                  <h4 className="text-base font-bold text-gray-200 group-hover:text-primary-400 transition-colors">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{task.project?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <FiClock className="mr-1" /> Due {moment(task.dueDate).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border
                    ${task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-gray-500/10 text-gray-300 border-gray-500/20'}
                  `}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-8 py-12 text-center text-gray-500 font-medium">
              No recent tasks found. Get to work!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
