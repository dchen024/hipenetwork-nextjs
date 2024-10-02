'use client';

import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error)
      console.error(`Error logging in with ${provider}:`, error.message);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-4'>
      <button
        onClick={() => handleOAuthLogin('github')}
        className='bg-gray-800 text-white px-4 py-2 rounded'
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => handleOAuthLogin('google')}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        Sign in with Google
      </button>
    </div>
  );
}
