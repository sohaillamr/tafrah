'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';

export default function AdminGate() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/staff/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    });
    if (res.ok) {
       router.push('/staff/dashboard');
    } else {
       setErr('ACCESS DENIED.');
    }
  };

  return (
    <div className='min-h-screen bg-black text-green-400 flex items-center justify-center font-mono'>
      <div className='max-w-md w-full p-8 border border-green-500/30 rounded-lg bg-gray-900/50 backdrop-blur-sm'>
        <div className='flex flex-col items-center mb-8'>
          <ShieldAlert className='w-16 h-16 mb-4 text-red-500' />
          <h1 className='text-2xl font-bold tracking-widest text-center'>RESTRICTED ACCESS</h1>
          <p className='text-xs opacity-70 tracking-widest mt-2'>AUTHORIZATION REQUIRED</p>
        </div>
        {err && <div className='mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm text-center'>{err}</div>}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <input type='text' value={user} onChange={(e)=>setUser(e.target.value)} placeholder='IDENTIFIER' className='w-full bg-black/50 border border-green-500/50 outline-none uppercase placeholder-green-800 p-3' />
          </div>
          <div>
            <input type='password' value={pass} onChange={(e)=>setPass(e.target.value)} placeholder='PASSPHRASE' className='w-full bg-black/50 border border-green-500/50 outline-none placeholder-green-800 p-3' />
          </div>
          <button type='submit' className='w-full bg-green-500/20 hover:bg-green-500/40 border border-green-500 p-3 font-bold tracking-widest transition-colors flex items-center justify-center gap-2'>
            <Lock className='w-4 h-4' /> INITIATE BREACH
          </button>
        </form>
      </div>
    </div>
  );
}
