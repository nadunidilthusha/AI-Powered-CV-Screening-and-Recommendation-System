import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  BadgeCheck,
  ShieldAlert,
  Save,
  FileUp,
  Trash2,
  X,
} from 'lucide-react';

import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SettingsPage = () => {
  const {
    user,
    updateUser,
    showToast,
  } = useAuth();

  const [profile, setProfile] =
    useState({
      fullName: '',
      email: '',
      phone: '',
      department:
        'Human Resources',
    });

  const [errors, setErrors] =
    useState({});

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    removingAvatar,
    setRemovingAvatar,
  ] = useState(false);

  const fileInputRef =
    useRef(null);

  const avatarUrl =
    user?.avatarUrl ?? null;

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          setLoadingProfile(true);

          const response =
            await authService.getMe();

          const data =
            response.data.data;

          setProfile({
            fullName:
              data.fullName || '',
            email:
              data.email || '',
            phone:
              data.phone || '',
            department:
              data.department ||
              'Human Resources',
          });

          updateUser({
            ...data,
            name:
              data.fullName,
            fullName:
              data.fullName,
            initials:
              data.fullName
                ?.split(' ')
                .map(
                  (name) =>
                    name[0]
                )
                .join('')
                .substring(
                  0,
                  2
                )
                .toUpperCase(),
          });
        } catch (err) {
          console.error(
            'Failed to load profile:',
            err
          );

          showToast(
            err.response?.data
              ?.message ||
              'Failed to load account settings.',
            'error'
          );
        } finally {
          setLoadingProfile(false);
        }
      };

    loadProfile();
  }, []);

  const clearError = (
    field
  ) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = {
        ...prev,
      };

      delete next[field];

      return next;
    });
  };

  const updateField =
    (field) => (e) => {
      setProfile((prev) => ({
        ...prev,
        [field]:
          e.target.value,
      }));

      clearError(field);
    };

  const handlePhoneChange =
    (e) => {
      setProfile((prev) => ({
        ...prev,
        phone: e.target.value.replace(
          /\D/g,
          ''
        ),
      }));

      clearError('phone');
    };

  const handleUploadClick =
    () => {
      fileInputRef.current?.click();
    };

  const handleFileChange =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      if (
        ![
          'image/png',
          'image/jpeg',
        ].includes(file.type)
      ) {
        showToast(
          'Please choose a JPG or PNG image.',
          'error'
        );

        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        showToast(
          'Image must be under 5MB.',
          'error'
        );

        return;
      }

      try {
        setUploading(true);

        const reader =
          new FileReader();

        reader.onload =
          async () => {
            try {
              const response =
                await authService.updateProfile(
                  {
                    avatarUrl:
                      reader.result,
                  }
                );

              const updatedUser =
                response.data.data;

              updateUser({
                ...updatedUser,
                name:
                  updatedUser.fullName,
                initials:
                  updatedUser.fullName
                    ?.split(' ')
                    .map(
                      (name) =>
                        name[0]
                    )
                    .join('')
                    .substring(
                      0,
                      2
                    )
                    .toUpperCase(),
                avatarUrl:
                  updatedUser.avatarUrl,
              });

              showToast(
                'Profile photo updated successfully.',
                'success'
              );
            } catch (err) {
              console.error(
                'Failed to upload profile photo:',
                err
              );

              showToast(
                err.response?.data
                  ?.message ||
                  'Failed to upload profile photo.',
                'error'
              );
            } finally {
              setUploading(false);
            }
          };

        reader.onerror =
          () => {
            setUploading(false);

            showToast(
              'Failed to read the selected image.',
              'error'
            );
          };

        reader.readAsDataURL(
          file
        );
      } catch (err) {
        setUploading(false);

        showToast(
          'Failed to upload profile photo.',
          'error'
        );
      }
    };

  const handleRemove =
    async () => {
      try {
        setRemovingAvatar(true);

        const response =
          await authService.removeAvatar();

        updateUser({
          avatarUrl:
            response.data.data
              ?.avatarUrl ?? null,
        });

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            '';
        }

        showToast(
          'Profile photo removed.',
          'success'
        );
      } catch (err) {
        console.error(
          'Failed to remove profile photo:',
          err
        );

        showToast(
          err.response?.data
            ?.message ||
            'Failed to remove profile photo.',
          'error'
        );
      } finally {
        setRemovingAvatar(false);
      }
    };

  const validate =
    () => {
      const newErrors = {};

      if (
        !profile.fullName.trim()
      ) {
        newErrors.fullName =
          'Full name is required.';
      }

      if (
        !profile.email.trim()
      ) {
        newErrors.email =
          'Work email is required.';
      } else if (
        !EMAIL_PATTERN.test(
          profile.email.trim()
        )
      ) {
        newErrors.email =
          'Please enter a valid email address.';
      }

      if (
        !profile.phone.trim()
      ) {
        newErrors.phone =
          'Phone number is required.';
      }

      if (
        !profile.department.trim()
      ) {
        newErrors.department =
          'Department is required.';
      }

      return newErrors;
    };

  const handleSave =
    async () => {
      const validationErrors =
        validate();

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {
        setErrors(
          validationErrors
        );

        showToast(
          'Please fill in all required fields before saving.',
          'error'
        );

        return;
      }

      try {
        setSaving(true);

        const response =
          await authService.updateProfile(
            {
              fullName:
                profile.fullName.trim(),
              email:
                profile.email.trim(),
              phone:
                profile.phone.trim(),
              department:
                profile.department.trim(),
            }
          );

        const updatedUser =
          response.data.data;

        setProfile({
          fullName:
            updatedUser.fullName ||
            '',
          email:
            updatedUser.email ||
            '',
          phone:
            updatedUser.phone ||
            '',
          department:
            updatedUser.department ||
            'Human Resources',
        });

        updateUser({
          ...updatedUser,
          name:
            updatedUser.fullName,
          fullName:
            updatedUser.fullName,
          initials:
            updatedUser.fullName
              ?.split(' ')
              .map(
                (name) =>
                  name[0]
              )
              .join('')
              .substring(
                0,
                2
              )
              .toUpperCase(),
        });

        setErrors({});

        showToast(
          'Profile updated successfully!',
          'success'
        );
      } catch (err) {
        console.error(
          'Failed to update profile:',
          err
        );

        showToast(
          err.response?.data
            ?.message ||
            'Failed to update profile.',
          'error'
        );
      } finally {
        setSaving(false);
      }
    };

  const handleCancel =
    () => {
      setProfile({
        fullName:
          user?.fullName || '',
        email:
          user?.email || '',
        phone:
          user?.phone || '',
        department:
          user?.department ||
          'Human Resources',
      });

      setErrors({});

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          '';
      }
    };

  if (loadingProfile) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          Loading account settings...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">
          Account settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your profile information
        </p>
      </div>

      <Card
        title="Profile information"
        subtitle="Update your photo and personal details"
      >
        {/* Profile Photo */}
        <div className="mb-6 flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white">
              {user?.initials ||
                'U'}
            </div>
          )}

          <div>
            <div className="flex gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={
                  handleFileChange
                }
                className="hidden"
                disabled={
                  uploading ||
                  removingAvatar
                }
              />

              <Button
                variant="secondary"
                size="sm"
                icon={FileUp}
                onClick={
                  handleUploadClick
                }
                loading={
                  uploading
                }
                disabled={
                  removingAvatar
                }
              >
                Upload photo
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={Trash2}
                onClick={
                  handleRemove
                }
                disabled={
                  !avatarUrl ||
                  uploading ||
                  removingAvatar
                }
                loading={
                  removingAvatar
                }
              >
                Remove
              </Button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              JPG or PNG, max 5MB.
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Full name"
            value={
              profile.fullName
            }
            onChange={
              updateField(
                'fullName'
              )
            }
            error={
              errors.fullName
            }
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                Work email
              </label>

              {EMAIL_PATTERN.test(
                profile.email.trim()
              ) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  <BadgeCheck
                    size={12}
                  />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  <ShieldAlert
                    size={12}
                  />
                  Unverified
                </span>
              )}
            </div>

            <input
              type="email"
              value={
                profile.email
              }
              onChange={
                updateField(
                  'email'
                )
              }
              className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 ${
                errors.email
                  ? 'border-red-300'
                  : 'border-slate-200'
              }`}
            />

            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <Input
            label="Phone number"
            hint="numbers only"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            value={
              profile.phone
            }
            onChange={
              handlePhoneChange
            }
            placeholder="e.g. 0771234567"
            error={
              errors.phone
            }
          />

          <Input
            as="select"
            label="Department"
            value={
              profile.department
            }
            onChange={
              updateField(
                'department'
              )
            }
            error={
              errors.department
            }
          >
            <option>
              Human Resources
            </option>
            <option>
              Engineering
            </option>
            <option>
              Operations
            </option>
            <option>
              Design
            </option>
            <option>
              Product
            </option>
            <option>
              Marketing
            </option>
          </Input>

          <Input
            label="Role"
            hint="assigned by your administrator"
            value={
              user?.role ===
              'admin'
                ? 'Administrator'
                : 'HR Manager'
            }
            disabled
            readOnly
          />
        </div>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-slate-200 pt-4">
          <Button
            variant="secondary"
            icon={X}
            onClick={
              handleCancel
            }
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            icon={Save}
            onClick={
              handleSave
            }
            loading={saving}
          >
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;