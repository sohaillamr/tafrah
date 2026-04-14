// app/courses/[id]/learn/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Abstract the heavy data parsing securely to the server side
import { fetchUnitStepsServerSide } from "@/lib/data/course-fetcher";
import CoursePlayerShell from "./_components/CoursePlayerShell";
import TopBar from "@/components/TopBar";
import { Loader2 } from "lucide-react";

export default async function CourseLearnPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getSession();

  if (!session) {
    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-xl text-[#2e5c8a]">Authentication required. Please log in.</h1>
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8f9fa] text-[#212529]">
      <TopBar />
      
      {/* Streaming via React Suspense */}
      <Suspense fallback={<CourseLoadingSkeleton />}>
        <CourseDataStreamer courseId={course.id} courseSlug={course.slug} category={course.category} />
      </Suspense>
    </div>
  );
}

// Isolated Async Fetcher (Resolves the Heavy Data securely)
async function CourseDataStreamer({ courseId, courseSlug, category }: { courseId: number, courseSlug: string, category: string }) {
  // We only pull the EXACT steps necessary for this specific module from our heavy data files
  // In a robust flow, the activeUnit would be fetched via DB or URL Param. For static proof: 
  const activeUnit = 0; 
  const scopedSteps = await fetchUnitStepsServerSide(courseSlug, category, activeUnit);
  
  if (!scopedSteps || scopedSteps.length === 0) {
      return <div className="p-8 text-center text-xl font-bold">Content unavailable.</div>;
  }

  // Pass ONLY the scoped steps down to the interactive client slice.
  // The client no longer imports 15MB of static content data upfront!
  return (
    <CoursePlayerShell 
      courseId={courseId} 
      courseSlug={courseSlug} 
      category={category}
      initialSteps={scopedSteps} 
    />
  );
}

// Neuro-Inclusive Loading State
function CourseLoadingSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-[#2e5c8a]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-lg animate-pulse font-semibold">جارِ تهيئة بيئة التعلم... / Instantiating Learning Environment...</p>
      </div>
    </div>
  );
}
