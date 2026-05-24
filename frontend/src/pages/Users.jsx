import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { FiTrash2, FiUsers, FiShield } from 'react-icons/fi';
import moment from 'moment';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to revoke this user\'s access?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse font-medium">Loading Workspace Directory...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight">Access Management</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">View and manage workspace members</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-surface/80 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Member
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Access Level
                </th>
                <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date Added
                </th>
                <th scope="col" className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Controls
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-surface/30">
              {users.map((user, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  key={user._id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-200">{user.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex items-center text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                      user.role === 'Admin' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.role === 'Admin' && <FiShield className="mr-1.5 h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-400">
                    {moment(user.createdAt).format('MMM Do, YYYY')}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Revoke Access"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No users found in directory.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Users;
