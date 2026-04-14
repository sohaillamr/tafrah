'use client';
import { useState } from 'react';
import { Shield, Ban, CheckCircle, Briefcase, Mail } from 'lucide-react';

export default function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);

  const handleAction = async (userId: number, action: string) => {
    setLoading(true);
    const res = await fetch('/api/staff/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action })
    });
    if (res.ok) {
      const { user } = await res.json();
      setUsers(users.map(u => u.id === userId ? { ...u, ...user } : u));
    }
    setLoading(false);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='border-b border-green-500/30 text-xs tracking-widest text-green-500/70'>
            <th className='p-3'>ID</th>
            <th className='p-3'>EMAIL / NAME</th>
            <th className='p-3'>ROLE</th>
            <th className='p-3'>STATUS</th>
            <th className='p-3 text-right'>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className='border-b border-green-500/10 hover:bg-green-500/5 transition-colors'>
              <td className='p-3 text-sm'>#{u.id}</td>
              <td className='p-3'>
                <div className='font-bold flex items-center gap-2'><Mail className='w-3 h-3 opacity-50'/> {u.email}</div>
                <div className='text-xs opacity-70'>{u.name}</div>
              </td>
              <td className='p-3 text-xs uppercase'>
                 <span className={'px-2 py-1 bg-gray-900 border rounded ' + (u.role==='admin' ? 'border-red-500 text-red-500' : u.role==='hr' ? 'border-purple-500 text-purple-500' : 'border-green-500 text-green-500')}>
                   {u.role}
                 </span>
              </td>
              <td className='p-3 text-xs uppercase'>
                <span className={'flex items-center gap-1 ' + ((u.status==='banned'||!u.available) ? 'text-red-500' : 'text-green-500')}>
                  {(u.status==='banned'||!u.available) ? <Ban className='w-3 h-3' /> : <CheckCircle className='w-3 h-3' />}
                  {u.status}
                </span>
              </td>
              <td className='p-3 space-x-2 text-right'>
                {u.status === 'banned' ? (
                  <button onClick={()=>handleAction(u.id, 'unban')} disabled={loading} className='px-3 py-1 border border-green-500 hover:bg-green-500/20 text-xs font-bold uppercase transition focus:outline-none'>UNBAN</button>
                ) : (
                   <button onClick={()=>handleAction(u.id, 'ban')} disabled={loading} className='px-3 py-1 border border-red-500 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase transition focus:outline-none'>BAN</button>
                )}
                {u.role !== 'hr' && (
                  <button onClick={()=>handleAction(u.id, 'make_hr')} disabled={loading} className='px-3 py-1 border border-purple-500 hover:bg-purple-500/20 text-purple-500 text-xs font-bold uppercase transition focus:outline-none'>MAKE HR</button>
                )}
                {u.role !== 'student' && (
                  <button onClick={()=>handleAction(u.id, 'make_student')} disabled={loading} className='px-3 py-1 border border-green-500 hover:bg-green-500/20 text-green-500 text-xs font-bold uppercase transition focus:outline-none'>MAKE STUDENT</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
