'use client';

import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const handleOAuthLogin = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error('Error logging in with GitHub:', error.message);
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <button
        onClick={() => handleOAuthLogin('github')}
        className='bg-gray-800 text-white px-4 py-2 rounded'
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
