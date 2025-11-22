'use client';

import { useAuthContext } from '@/utils/contexts/AuthContext';

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;