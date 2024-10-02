'use client';

import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className='flex items-center justify-center h-screen'>
      {user ? (
        <div>
          <h1 className='text-2xl'>Welcome, {user.email}</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
            className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
          >
            Logout
          </button>
        </div>
      ) : (
        <h1 className='text-4xl font-bold'>
          Please login to access this page.
        </h1>
      )}
    </div>
  );
}
