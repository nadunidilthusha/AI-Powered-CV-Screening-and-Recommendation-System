import { useState } from 'react';
import { Plus, X, ChevronDown, CheckCircle2, XCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Rashaan Weerasooriya', email: 'rashaan@company.com', role: 'System Administrator' },
  { id: 2, name: 'Nadeesha R.', email: 'nadeesha@company.com', role: 'HR Manager' },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditUser, setActiveEditUser] = useState(null);

  // Add User Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Select a role...',
    password: '',
    confirmPassword: '',
    sendEmail: true,
  });

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Edit Role State
  const [newAssignedRole, setNewAssignedRole] = useState('');

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Password strength validation checkers
  const hasMinLength = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.role || formData.role === 'Select a role...') {
      newErrors.role = 'Please select a system role.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!isPasswordStrong) {
      newErrors.password = 'Password does not meet security requirements.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      setUsers([...users, newUser]);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'Select a role...',
        password: '',
        confirmPassword: '',
        sendEmail: true,
      });
      setErrors({});
    }
  };

  const openEditModal = (user) => {
    setActiveEditUser(user);
    setNewAssignedRole(user.role);
    setIsEditModalOpen(true);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!activeEditUser) return;

    setUsers(users.map((u) => (u.id === activeEditUser.id ? { ...u, role: newAssignedRole } : u)));
    setIsEditModalOpen(false);
    setActiveEditUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add New User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-md ${
                    user.role === 'System Administrator' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openEditModal(user)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD NEW USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add New User</h2>
                <p className="text-xs text-slate-500 mt-1">Create a new account and assign permissions.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-md">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Kamal Perera" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Corporate Email</label>
                    <input 
                      type="text" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="kamal@company.com" 
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                      }`} 
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* System Role Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">System Role</label>
                  <div className="relative">
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                    >
                      <option disabled>Select a role...</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="System Administrator">System Administrator</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                  {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                </div>

                {/* Password Setup with Strength Checklist & Eye Toggles */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Password Setup</label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Secure Password" 
                        className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                        }`} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password" 
                        className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Checklist */}
                  {formData.password && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                        <ShieldCheck size={14} className="text-blue-600" /> Password Strength Requirements:
                      </p>
                      <p className={hasMinLength ? 'text-emerald-600 flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                        <span>{hasMinLength ? '✓' : '•'}</span> Minimum 8 characters
                      </p>
                      <p className={hasUpperCase && hasLowerCase ? 'text-emerald-600 flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                        <span>{hasUpperCase && hasLowerCase ? '✓' : '•'}</span> Uppercase & lowercase letters
                      </p>
                      <p className={hasNumber ? 'text-emerald-600 flex items-center gap-1' : 'text-slate-400 flex items-center gap-1'}>
                        <span>{hasNumber ? '✓' : '•'}</span> At least one number
                      </p>
                    </div>
                  )}

                  {/* Real-time Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-1.5 flex items-center text-xs font-medium">
                      {formData.password === formData.confirmPassword ? (
                        <span className="flex items-center text-emerald-600">
                          <CheckCircle2 size={14} className="mr-1" /> match
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <XCircle size={14} className="mr-1" /> passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input 
                    type="checkbox" 
                    name="sendEmail"
                    checked={formData.sendEmail}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" 
                  />
                  <span className="text-sm text-slate-600 font-medium">Send welcome email with login instructions</span>
                </label>
              </div>

              <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {isEditModalOpen && activeEditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit User Role</h2>
                <p className="text-xs text-slate-500 mt-1">Update permission level for {activeEditUser.name}.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-md">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateRole}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Select New Role</label>
                  <div className="relative">
                    <select 
                      value={newAssignedRole}
                      onChange={(e) => setNewAssignedRole(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                    >
                      <option value="HR Manager">HR Manager</option>
                      <option value="System Administrator">System Administrator</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;