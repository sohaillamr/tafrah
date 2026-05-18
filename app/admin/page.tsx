"use client";

import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { useAuth } from "../components/AuthProvider";

type Stats = {
  overview: {
    totalUsers: number;
    totalStudents: number;
    pendingUsers: number;
    bannedUsers: number;
    totalCourses: number;
    availableCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
    totalTickets: number;
    openTickets: number;
  };
  recentUsers: { id: number; name: string; role: string; status: string; createdAt: string }[];
  recentLogs: { id: number; action: string; details: string | null; createdAt: string; user: { name: string; role: string } | null }[];
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch("/api/admin/stats").then((res) => (res.ok ? res.json() : null)).then(setStats);
  }, [user]);

  if (loading) return <div className="p-12">Loading...</div>;
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-3xl px-6 py-12">You are not authorized to access this page.</main>
      </div>
    );
  }

  const overview = stats?.overview;
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TopBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 text-[#212529]">
        <section>
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">Tafrah admin</h1>
          <p className="mt-2 text-[#495057]">Autism-first platform overview. HR/company tools have been removed from this surface.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Stat label="Users" value={overview?.totalUsers ?? 0} />
          <Stat label="Students" value={overview?.totalStudents ?? 0} />
          <Stat label="Courses" value={overview?.totalCourses ?? 0} />
          <Stat label="Open tickets" value={overview?.openTickets ?? 0} />
          <Stat label="Pending users" value={overview?.pendingUsers ?? 0} />
          <Stat label="Banned users" value={overview?.bannedUsers ?? 0} />
          <Stat label="Enrollments" value={overview?.totalEnrollments ?? 0} />
          <Stat label="Completion rate" value={`${overview?.completionRate ?? 0}%`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-sm border border-[#D9E6F2] bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold text-[#2E5C8A]">Recent users</h2>
            <div className="flex flex-col gap-3">
              {stats?.recentUsers.map((item) => (
                <div key={item.id} className="rounded-sm border border-[#D9E6F2] p-3">
                  <strong>{item.name}</strong>
                  <div className="text-sm text-[#6C757D]">{item.role} - {item.status}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-[#D9E6F2] bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold text-[#2E5C8A]">Recent activity</h2>
            <div className="flex flex-col gap-3">
              {stats?.recentLogs.map((item) => (
                <div key={item.id} className="rounded-sm border border-[#D9E6F2] p-3">
                  <strong>{item.action}</strong>
                  <div className="text-sm text-[#6C757D]">{item.user?.name || "System"} - {item.details || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-[#D9E6F2] bg-white p-5">
      <p className="text-sm text-[#6C757D]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#2E5C8A]">{value}</p>
    </div>
  );
}
