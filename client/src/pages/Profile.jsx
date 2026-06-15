import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErrors }, reset: resetPw } = useForm();

  const onProfileSubmit = async (data) => {
    setSaving(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setChangingPw(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed!');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-grotesk font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your account</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border-glow flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C084FC] to-[#A855F7] flex items-center justify-center text-2xl font-bold text-white glow-violet">
          {getInitials(user?.name)}
        </div>
        <div>
          <h2 className="font-grotesk font-bold text-lg">{user?.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] mt-1 inline-block capitalize">{user?.role}</span>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border-glow">
        <h3 className="text-sm font-grotesk font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-left w-full text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Name</label>
            <input
              {...regProfile('name', { required: 'Name is required' })}
              className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-base focus:outline-none focus:border-[var(--color-accent)]/50 transition-all leading-relaxed"
            />
            {profileErrors.name && <span className="text-xs text-red-400 block text-left">{profileErrors.name.message}</span>}
          </div>
          <div>
            <label className="block text-left w-full text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Email</label>
            <input
              {...regProfile('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-base focus:outline-none focus:border-[var(--color-accent)]/50 transition-all leading-relaxed"
            />
            {profileErrors.email && <span className="text-xs text-red-400 block text-left">{profileErrors.email.message}</span>}
          </div>
          <button type="submit" disabled={saving} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-white text-base font-medium btn-shine hover:scale-[1.02] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 border-glow">
        <h3 className="text-sm font-grotesk font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePw(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-left w-full text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Current Password</label>
            <input
              {...regPw('currentPassword', { required: 'Current password is required' })}
              type="password"
              className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-base focus:outline-none focus:border-[var(--color-accent)]/50 transition-all leading-relaxed"
            />
            {pwErrors.currentPassword && <span className="text-xs text-red-400 block text-left">{pwErrors.currentPassword.message}</span>}
          </div>
          <div>
            <label className="block text-left w-full text-xs font-medium text-[var(--color-text-muted)] mb-1.5">New Password</label>
            <input
              {...regPw('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              type="password"
              className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] text-base focus:outline-none focus:border-[var(--color-accent)]/50 transition-all leading-relaxed"
            />
            {pwErrors.newPassword && <span className="text-xs text-red-400 block text-left">{pwErrors.newPassword.message}</span>}
          </div>
          <button type="submit" disabled={changingPw} className="px-6 py-3.5 rounded-xl border border-[var(--color-border)] text-base font-medium hover:bg-[var(--color-surface-2)] transition-all disabled:opacity-50">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
