import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';

export function useProfile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await profileService.get(user.id);
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateProfile = async (payload: Partial<Pick<Profile, 'name' | 'whatsapp' | 'avatar_url'>>) => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await profileService.update(user.id, payload);
      setProfile(updated);
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    const url = await profileService.uploadAvatar(user.id, file);
    await updateProfile({ avatar_url: url });
    return url;
  };

  return { profile, loading, saving, refetch: fetch, updateProfile, uploadAvatar };
}
