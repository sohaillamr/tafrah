'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';

type Student = {
  id: number;
  name: string;
  email: string;
  category: string;
  chapter: { name: string } | null;
  progress: any[];
};

type Chapter = {
  id: number;
  name: string;
};

export default function CenterDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | ''>('');
  const [inviteLink, setInviteLink] = useState('');
  const [centerId, setCenterId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studsRes = await fetch('/api/center/students');
      if (studsRes.ok) {
        const data = await studsRes.json();
        setStudents(data);
      } else {
        router.push('/');
      }

      const chapsRes = await fetch('/api/center/chapters');
      if (chapsRes.ok) {
        const data = await chapsRes.json();
        setChapters(data);
      }
      
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const me = await meRes.json();
        if (me.user?.centerId) {
          setCenterId(me.user.centerId.toString());
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calculateProgress = (progArray: any[]) => {
    if (!progArray || progArray.length === 0) return 0;
    const passed = progArray.filter((p: any) => p.quizPassed).length;
    return Math.round((passed / progArray.length) * 100);
  };

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const assignChapter = async () => {
    if (!selectedChapterId || selectedStudents.length === 0) return;
    try {
      const res = await fetch('/api/center/assign-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents,
          chapterId: Number(selectedChapterId)
        })
      });
      if (res.ok) {
        setIsChapterModalOpen(false);
        setSelectedStudents([]);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateInviteLink = () => {
    if (centerId) {
      const link = `${window.location.origin}/auth/quiz?centerId=${centerId}`;
      setInviteLink(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2E5C8A]">Center Administration</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => { generateInviteLink(); setIsInviteModalOpen(true); }}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold"
            >
              + Add Student
            </button>
            <button 
              onClick={() => setIsChapterModalOpen(true)}
              disabled={selectedStudents.length === 0}
              className={`px-6 py-2 rounded-md font-semibold text-white ${selectedStudents.length > 0 ? 'bg-[#2E5C8A]' : 'bg-gray-300'}`}
            >
              Assign Chapter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedStudents(students.map(s => s.id));
                      else setSelectedStudents([]);
                    }}
                    checked={students.length > 0 && selectedStudents.length === students.length}
                  />
                </th>
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Category</th>
                <th className="p-4 font-semibold text-gray-700">Current Chapter</th>
                <th className="p-4 font-semibold text-gray-700">LMS Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 w-12">
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                      {student.category || 'NONE'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">
                    {student.chapter?.name || 'Unassigned'}
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculateProgress(student.progress)}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">{calculateProgress(student.progress)}%</p>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Chapter Modal */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Assign Chapter</h2>
            <p className="text-gray-600 mb-6">Select a chapter to assign to the {selectedStudents.length} selected students.</p>
            <select 
              className="w-full border p-3 rounded-lg mb-6"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(Number(e.target.value))}
            >
              <option value="">Select Chapter</option>
              {chapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 text-gray-600 font-semibold" onClick={() => setIsChapterModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-[#2E5C8A] text-white rounded-lg font-semibold" onClick={assignChapter}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Students</h2>
            <p className="text-gray-600 mb-6">Send this unique invitation link to your students. They will be automatically mapped to your center upon signup.</p>
            <input 
              type="text" 
              readOnly 
              value={inviteLink} 
              className="w-full border p-3 rounded-lg mb-6 bg-gray-50 text-gray-700" 
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 text-gray-600 font-semibold" onClick={() => setIsInviteModalOpen(false)}>Close</button>
              <button 
                className="px-4 py-2 bg-[#2E5C8A] text-white rounded-lg font-semibold" 
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert('Link copied to clipboard!');
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}