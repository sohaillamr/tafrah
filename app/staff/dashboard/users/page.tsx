import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import UserManagementClient from './UserManagementClient';

export default async function AdminUsersPage() {
  try {
    const session = await getAdminSession();
    if (!session) redirect('/staff/login');

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return (
      <div className='min-h-screen bg-black text-green-400 font-mono p-8'>
        <header className='flex items-center gap-4 border-b border-green-500/30 pb-4 mb-8'>
          <Link href='/staff/dashboard' className='hover:bg-green-500/20 p-2 rounded'><ArrowLeft className='w-6 h-6' /></Link>
          <ShieldAlert className='w-8 h-8 text-green-500' />
          <h1 className='text-2xl font-bold tracking-widest uppercase'>User Records [GOD MODE]</h1>
        </header>

        <div className='p-6 border border-green-500/30 bg-green-900/10'>
           <UserManagementClient initialUsers={users} />
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    return (
      <div className='min-h-screen bg-black text-red-500 font-mono p-8'>
        <h1 className='text-2xl font-bold'>CRITICAL VAULT ERROR</h1>
        <pre className='mt-4 p-4 bg-red-900/20 border border-red-500/50 whitespace-pre-wrap'>{error.message || String(error)}</pre>
        <pre className='mt-4 p-4 bg-red-900/20 border border-red-500/50 whitespace-pre-wrap'>{error.stack}</pre>
      </div>
    );
  }
}
