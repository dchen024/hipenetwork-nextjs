'use client';

import { supabase } from '../../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'; // Import Card components
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle email/password login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  // Function to handle OAuth login (GitHub, Google)
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      console.error(`Error logging in with ${provider}:`, error.message);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      {/* Card component wrapping the login form */}
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold text-center mb-4'>
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Form for Email/Password Login */}
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <Button
            variant='default'
            onClick={handleLogin}
            disabled={loading}
            className='w-full'
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          {/* OAuth Buttons for GitHub and Google */}
          <Button
            variant='outline'
            onClick={() => handleOAuthLogin('github')}
            className='w-full'
          >
            Sign in with GitHub
          </Button>

          <Button
            variant='outline'
            onClick={() => handleOAuthLogin('google')}
            className='w-full'
          >
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
