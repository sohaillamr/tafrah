import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { fetchUnitStepsServerSide } from '@/lib/data/course-fetcher';
import CoursePlayerShell from './_components/CoursePlayerShell';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CourseLearnPage(props: PageProps) {
  const [ { id }, searchParams ] = await Promise.all([
    props.params,
    props.searchParams
  ]);
  const session = await getSession();

  if (!session) {
    return (
        <div className='flex h-screen items-center justify-center'>
            <h1 className='text-xl text-[#2e5c8a]'>Authentication required. Please log in.</h1>
        </div>
    )
  }

  // Database Validation
  const course = await prisma.course.findUnique({
    where: { slug: id },
  });

  if (!course || course.isArchived) {
    notFound();
  }

  const isAdmin = session.role === 'admin' || session.role === 'supreme_admin';
  if (!isAdmin) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId: course.id, userId: session.userId }
    });
    if (!enrollment) {
      return (
        <div className='flex h-screen items-center justify-center'>
          <h1 className='text-xl text-[#2e5c8a]'>Not enrolled. Please enroll to access this course.</h1>
        </div>
      );
    }
  }

  const unitParam = searchParams.unit;
  let activeUnit = 0;
  if (unitParam && !Array.isArray(unitParam)) {
    const paramNum = parseInt(unitParam, 10);
    if (!isNaN(paramNum)) {
       activeUnit = Math.max(0, paramNum - 1);
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-[#f8f9fa] text-[#212529]'>

      {/* Streaming via React Suspense */}
      <Suspense fallback={<CourseLoadingSkeleton />}>
        <CourseDataStreamer courseId={course.id} courseSlug={course.slug} category={course.category} activeUnit={activeUnit} />
      </Suspense>
    </div>
  );
}

// Isolated Async Fetcher (Resolves the Heavy Data securely)
async function CourseDataStreamer({ courseId, courseSlug, category, activeUnit }: { courseId: number, courseSlug: string, category: string, activeUnit: number }) {
  try {
    const scopedSteps = await fetchUnitStepsServerSide(courseSlug, category, activeUnit);
    
    if (!scopedSteps || scopedSteps.length === 0) {
        console.error("DEBUG: Course found but Units are missing in DB.");
        return (
          <div className='flex h-full items-center justify-center'>
            <div className='p-8 text-center text-xl font-bold'>Content unavailable for unit {activeUnit}.</div>
          </div>
        );
    }

    return (
      <CoursePlayerShell
        courseId={courseId}
        courseSlug={courseSlug}
        category={category}
        initialSteps={scopedSteps}
      />
    );
  } catch (error) {
    console.error('Failed fetching data:', error);
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='p-8 text-center text-xl font-bold text-red-500'>Error loading content. Check logs.</div>
      </div>
    );
  }
}

// Neuro-Inclusive Loading State
function CourseLoadingSkeleton() {
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-[#2e5c8a]'>
        <Loader2 className='h-10 w-10 animate-spin text-blue-500' />
        <p className='text-lg animate-pulse font-semibold'>جارِ تهيئة بيئة التعلم... / Instantiating Learning Environment...</p>
      </div>
    </div>
  );
}
