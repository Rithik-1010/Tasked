import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Dock from '../components/Dock';
import AnimatedBackground from '../components/AnimatedBackground';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      switch (e.key.toLowerCase()) {
        case 'd': navigate('/dashboard'); break;
        case 't': navigate('/tasks'); break;
        case 'b': navigate('/kanban'); break;
        case 'a': navigate('/analytics'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass px-4 py-3 flex items-center justify-between">
        <button onClick={() => setCollapsed(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C084FC] to-[#A855F7] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="font-grotesk font-bold text-sm">TASKED</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Main content */}
      <main
        className="relative z-10 transition-all duration-300 pt-16 lg:pt-6 pb-24 lg:pb-6 px-4 lg:px-8"
        style={{
          marginLeft: windowWidth >= 1024 ? (collapsed ? '104px' : '272px') : '0px'
        }}
      >
        <Outlet />
      </main>

      <Dock />
    </div>
  );
};

export default DashboardLayout;
