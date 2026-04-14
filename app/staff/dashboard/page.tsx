import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Shield, Users, BookOpen, AlertTriangle, Activity } from 'lucide-react';
import { SystemPulse } from './_components/SystemPulse';
import { Impersonator } from './_components/Impersonator';

export default async function AdminDashboard() {
  try {
    const session = await getAdminSession();
    if (!session) redirect('/staff/login');

    const usersCount = await prisma.user.count();
    const coursesCount = await prisma.course.count();
    const ticketsCount = await prisma.ticket.count({ where: { status: 'new' } });

    return (
      <div className='min-h-screen bg-black text-green-400 font-mono p-8 flex flex-col'>
        <header className='flex items-center justify-between border-b border-green-500/30 pb-4 mb-8 shrink-0'>
          <div className='flex items-center gap-4'>
            <Shield className='w-8 h-8 text-green-500' />
            <h1 className='text-3xl font-bold tracking-widest uppercase'>Central Command</h1>
          </div>
          <div className='text-sm opacity-70 bg-green-900/30 px-3 py-1 rounded border border-green-500/30'>SESSION: SUPREME_ADMIN</div>
        </header>

        <div className='grid lg:grid-cols-4 gap-6 flex-1 min-h-[600px]'>
          {/* Main Controls Panel */}
          <div className='lg:col-span-3 flex flex-col gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='border border-green-500/30 bg-green-950/20 p-6 rounded flex flex-col items-center justify-center gap-2'>
                <div className='text-xs opacity-70 tracking-widest'>TOTAL USERS</div>
                <div className='text-4xl font-bold text-green-300'>{usersCount}</div>
                <Users className='w-6 h-6 opacity-30 mt-2' />
              </div>
              <div className='border border-green-500/30 bg-green-950/20 p-6 rounded flex flex-col items-center justify-center gap-2'>
                <div className='text-xs opacity-70 tracking-widest'>COURSES</div>
                <div className='text-4xl font-bold text-green-300'>{coursesCount}</div>
                <BookOpen className='w-6 h-6 opacity-30 mt-2' />
              </div>
              <div className='border border-red-500/30 bg-red-950/20 text-red-400 p-6 rounded flex flex-col items-center justify-center gap-2'>
                <div className='text-xs opacity-70 tracking-widest'>NEW TICKETS</div>
                <div className='text-4xl font-bold text-red-300'>{ticketsCount}</div>
                <AlertTriangle className='w-6 h-6 opacity-30 mt-2' />
              </div>
              <div className='border border-blue-500/30 bg-blue-950/20 text-blue-400 p-6 rounded flex flex-col items-center justify-center gap-2'>
                <div className='text-xs opacity-70 tracking-widest'>SYSTEM STATUS</div>
                <div className='text-2xl font-bold text-blue-300 tracking-widest mt-2'>ONLINE</div>
                <Activity className='w-6 h-6 opacity-30 mt-2' />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Link href='/staff/dashboard/users' className='group flex flex-col p-6 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all rounded'>
                <span className='uppercase font-bold tracking-widest text-lg group-hover:text-green-300 mb-2'>User Records</span>
                <span className='text-xs text-green-500/60 leading-relaxed font-sans'>Manage enrollments, issue refunds, and override security flags.</span>
              </Link>
              <Link href='/staff/dashboard/courses' className='group flex flex-col p-6 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all rounded'>
                <span className='uppercase font-bold tracking-widest text-lg group-hover:text-green-300 mb-2'>Course Matrix</span>
                <span className='text-xs text-green-500/60 leading-relaxed font-sans'>Create module structures, ingest content nodes, and publish updates.</span>
              </Link>
              <Link href='/staff/dashboard/tickets' className='group flex flex-col p-6 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all rounded'>
                <span className='uppercase font-bold tracking-widest text-lg group-hover:text-green-300 mb-2'>Support Queue</span>
                <span className='text-xs text-green-500/60 leading-relaxed font-sans'>Resolve pending user issues and escalate anomalies.</span>
              </Link>
            </div>

            {/* Impersonation and other direct actions go here */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Impersonator />
              {/* Future Expansion module (like broadcasts) */}
              <div className='border border-yellow-500/30 bg-yellow-950/20 border-dashed p-6 rounded flex flex-col items-center justify-center opacity-50 p-8'>
                <span className='text-yellow-500 uppercase font-bold tracking-widest text-sm mb-2'>Module Offline</span>
                <span className='text-yellow-600/60 text-xs font-sans'>Broadcast System Awaiting Deployment</span>
              </div>
            </div>
          </div>

          {/* System Pulse Live Log Terminal */}
          <div className='h-full min-h-[400px]'>
            <SystemPulse />
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    return (
      <div className='min-h-screen bg-black text-red-500 font-mono p-8 flex flex-col items-center justify-center'>
        <div className='border-2 border-red-500 bg-red-950/50 p-8 rounded max-w-3xl w-full'>
          <h1 className='text-3xl font-bold tracking-widest uppercase mb-4'>CRITICAL VAULT ERROR</h1>
          <p className='text-red-400 mb-6'>The central command sequence has failed to initialize due to a systemic fault.</p>
          <pre className='mt-4 p-4 bg-black border border-red-500/50 rounded whitespace-pre-wrap overflow-auto'>{error.message || String(error)}</pre>
          <pre className='mt-4 p-4 bg-black border border-red-500/50 rounded whitespace-pre-wrap text-sm text-red-400 overflow-auto max-h-64'>{error.stack}</pre>
        </div>
      </div>
    );
  }
}
