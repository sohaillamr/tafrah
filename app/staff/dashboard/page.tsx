import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Shield, Users, BookOpen, AlertTriangle, Activity } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect('/staff/login');

  const usersCount = await prisma.user.count();
  const coursesCount = await prisma.course.count();
  const ticketsCount = await prisma.ticket.count({ where: { status: 'new' } });

  return (
    <div className='min-h-screen bg-black text-green-400 font-mono p-8'>
      <header className='flex items-center justify-between border-b border-green-500/30 pb-4 mb-8'>
        <div className='flex items-center gap-4'>
          <Shield className='w-8 h-8 text-green-500' />
          <h1 className='text-2xl font-bold tracking-widest uppercase'>Central Command</h1>
        </div>
        <div className='text-sm opacity-70'>SESSION: SUPREME_ADMIN</div>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
        <div className='border border-green-500/30 bg-green-900/10 p-6 rounded flex items-center justify-between'>
          <div>
            <div className='text-sm opacity-70 mb-1'>TOTAL USERS</div>
            <div className='text-3xl font-bold'>{usersCount}</div>
          </div>
          <Users className='w-8 h-8 opacity-50' />
        </div>
        <div className='border border-green-500/30 bg-green-900/10 p-6 rounded flex items-center justify-between'>
          <div>
            <div className='text-sm opacity-70 mb-1'>COURSES</div>
            <div className='text-3xl font-bold'>{coursesCount}</div>
          </div>
          <BookOpen className='w-8 h-8 opacity-50' />
        </div>
        <div className='border text-red-400 border-red-500/30 bg-red-900/10 p-6 rounded flex items-center justify-between'>
          <div>
            <div className='text-sm opacity-70 mb-1'>NEW TICKETS</div>
            <div className='text-3xl font-bold'>{ticketsCount}</div>
          </div>
          <AlertTriangle className='w-8 h-8 opacity-50' />
        </div>
        <div className='border border-blue-500/30 text-blue-400 bg-blue-900/10 p-6 rounded flex items-center justify-between'>
          <div>
            <div className='text-sm opacity-70 mb-1'>SYSTEM STATUS</div>
            <div className='text-3xl font-bold'>ONLINE</div>
          </div>
          <Activity className='w-8 h-8 opacity-50' />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Link href='/staff/dashboard/users' className='p-6 border border-green-500/30 hover:bg-green-500/10 transition-colors uppercase font-bold text-center tracking-widest'>
          User Records
        </Link>
        <Link href='/staff/dashboard/courses' className='p-6 border border-green-500/30 hover:bg-green-500/10 transition-colors uppercase font-bold text-center tracking-widest'>
          Course Matrix
        </Link>
        <Link href='/staff/dashboard/tickets' className='p-6 border border-green-500/30 hover:bg-green-500/10 transition-colors uppercase font-bold text-center tracking-widest'>
          Support Queue
        </Link>
      </div>
    </div>
  );
}
