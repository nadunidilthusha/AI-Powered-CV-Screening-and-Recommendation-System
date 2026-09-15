import { useRef, useState } from 'react';
import { BadgeCheck, ShieldAlert, Save } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import useAuth from '../../hooks/useAuth';

const INITIAL_PROFILE = {
  fullName: 'Nadeesha Ranasinghe',
  email: 'nadeesha@talentlens.io',
  phone: '0771234567',
  department: 'Human Resources',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SettingsPage = () => {
  const { user, showToast, updateUser } = useAuth();
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  // Avatar lives in AuthContext (not local state) so Navbar and Sidebar,
  // which also read `user` from that context, show the same photo.
  const avatarUrl = user?.avatarUrl ?? null;
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    clearError(field);
  };

  const handlePhoneChange = (e) => {
    setProfile((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }));
    clearError('phone');
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPG or PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    // Preview it locally and push it into AuthContext immediately, so it
    // shows up in the Navbar right away. In production, upload `file` via
    // FormData to your backend first and pass the URL it returns instead.
    const previewUrl = URL.createObjectURL(file);
    updateUser({ avatarUrl: previewUrl });
    showToast('Profile photo updated.', 'success');
  };

  const handleRemove = () => {
    updateUser({ avatarUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    // TODO: also call DELETE /api/users/me/avatar on the backend
  };

  const handleCancel = () => {
    setProfile(INITIAL_PROFILE);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Work email is required.';
    } else if (!EMAIL_PATTERN.test(profile.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!profile.department.trim()) newErrors.department = 'Department is required.';
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fill in all required fields before saving.', 'error');
      return;
    }

    // TODO: replace with a real call, e.g.
    // await api.put('/users/me', profile)
    console.log('Saving profile', profile);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Account settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your profile information</p>
      </div>

      <Card title="Profile information" subtitle="Update your photo and personal details">
        <div className="mb-6 flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="h-[72px] w-[72px] rounded-full object-cover" />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white">
              NR
            </div>
          )}

          <div>
            <div className="flex gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="secondary" size="sm" onClick={handleUploadClick}>Upload photo</Button>
              <Button variant="secondary" size="sm" onClick={handleRemove} disabled={!avatarUrl}>Remove</Button>
            </div>
            <p className="mt-2 text-xs text-slate-400">JPG or PNG, at least 200×200px, max 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Full name"
            value={profile.fullName}
            onChange={updateField('fullName')}
            error={errors.fullName}
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">Work email</label>
              {EMAIL_PATTERN.test(profile.email.trim()) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  <BadgeCheck size={12} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  <ShieldAlert size={12} /> Unverified
                </span>
              )}
            </div>
            <input
              type="email"
              value={profile.email}
              onChange={updateField('email')}
              className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 ${
                errors.email ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
          </div>

          <Input
            label="Phone number"
            hint="numbers only"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            value={profile.phone}
            onChange={handlePhoneChange}
            placeholder="e.g. 0771234567"
            error={errors.phone}
          />

          <Input
            as="select"
            label="Department"
            value={profile.department}
            onChange={updateField('department')}
            error={errors.department}
          >
            <option>Human Resources</option>
            <option>Engineering</option>
            <option>Operations</option>
          </Input>

          <Input label="Role" hint="assigned by your administrator" defaultValue="HR Manager" disabled />
        </div>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-slate-200 pt-4">
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          <Button icon={Save} onClick={handleSave}>Save changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;