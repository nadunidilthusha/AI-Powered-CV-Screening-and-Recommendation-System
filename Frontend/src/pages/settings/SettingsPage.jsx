import { useRef, useState } from 'react';
import { BadgeCheck, Save, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const INITIAL_PROFILE = {
  fullName: 'Nadeesha Ranasinghe',
  jobTitle: 'HR Manager',
  email: 'nadeesha@talentlens.io',
  phone: '0771234567',
  department: 'Human Resources',
};

const SettingsPage = () => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState(null); // null = show initials fallback
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    setProfile((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }));
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

    // Preview it locally. In production, upload `file` via FormData to your
    // backend and set avatarUrl to the URL the server returns instead.
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // TODO: also call DELETE /api/users/me/avatar on the backend
  };

  const handleCancel = () => {
    setProfile(INITIAL_PROFILE);
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    // TODO: replace with a real call, e.g.
    // await api.put('/users/me', profile)
    console.log('Saving profile', profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Account settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your profile information</p>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 size={16} />
          Profile updated successfully.
        </div>
      )}

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
          <Input label="Full name" value={profile.fullName} onChange={updateField('fullName')} />
          <Input label="Job title" value={profile.jobTitle} onChange={updateField('jobTitle')} />
          <div>
            <Input label="Work email" type="email" value={profile.email} onChange={updateField('email')} />
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              <BadgeCheck size={12} /> Verified
            </span>
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
          />

          <Input as="select" label="Department" value={profile.department} onChange={updateField('department')}>
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