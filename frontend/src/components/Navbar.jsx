import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = ({ setMobileMenuOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-border h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Global Search Placeholder */}
      <div className="hidden md:flex flex-1 max-w-md ml-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors">
            <FiSearch className="h-4 w-4" />
          </div>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all shadow-inner"
            placeholder="Search tasks, projects..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-600 font-semibold px-2 py-0.5 rounded border border-border bg-surface">Ctrl+K</span>
          </div>
        </div>
      </div>

      {/* Right side nav */}
      <div className="flex items-center space-x-6 ml-auto">
        <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 relative hidden sm:block">
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <FiBell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 sm:pl-6 sm:border-l border-border">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-bold text-white tracking-wide">{user?.name}</span>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">{user?.role}</span>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 p-[2px]">
            <div className="h-full w-full rounded-full bg-surface flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </motion.div>
          
          <button
            onClick={handleLogout}
            className="ml-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all p-2 rounded-xl"
            title="Logout"
          >
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
