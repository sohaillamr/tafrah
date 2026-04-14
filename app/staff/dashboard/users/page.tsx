import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import UserManagementClient from './UserManagementClient';

export default async function AdminUsersPage() {
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
}
