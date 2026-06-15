import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C084FC] to-[#A855F7] flex items-center justify-center glow-violet-strong shadow-lg shadow-[#A855F7]/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="font-grotesk text-3xl font-bold tracking-tight text-white">TASKED</h1>
        </div>

        <div className="glass-strong rounded-3xl p-8" style={{ borderColor: 'rgba(192,132,252,0.15)', boxShadow: '0 0 80px rgba(192,132,252,0.08)' }}>
          <h2 className="text-2xl font-grotesk font-bold mb-2 text-center text-white">Welcome back</h2>
          <p className="text-sm text-[var(--color-text-muted)] text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Email address</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="w-full px-6 py-4 rounded-xl bg-transparent border border-[var(--color-border)] text-white text-base focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-text-muted)]/50 leading-relaxed"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="text-xs text-red-400 mt-1.5 block text-left">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-left w-full text-sm font-medium text-[var(--color-text-secondary)] mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-6 py-4 rounded-xl bg-transparent border border-[var(--color-border)] text-white text-base focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-text-muted)]/50 leading-relaxed"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <span className="text-xs text-red-400 mt-1.5 block text-left">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white text-base font-medium btn-shine glow-violet hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-[var(--color-text-muted)] text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
