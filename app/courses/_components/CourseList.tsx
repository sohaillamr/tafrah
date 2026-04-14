import Link from "next/link";
import { BookOpen, MapPin, Database, Brush, Code, Target, Lock } from "lucide-react";

interface CourseData {
  id: number; slug: string; titleAr: string; titleEn: string;
  descAr: string; descEn: string; hours: number; modules: number;
  difficulty: string; category: string; available: boolean;
}

export default function CourseList({ courses, language, user }: { courses: CourseData[], language: string, user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const title = language === "ar" ? course.titleAr : course.titleEn;
        const desc = language === "ar" ? course.descAr : course.descEn;
        const categoryIcon = () => {
          switch (course.category) {
            case "data-entry": return <Database className="w-5 h-5" />;
            case "design": return <Brush className="w-5 h-5" />;
            case "programming": return <Code className="w-5 h-5" />;
            default: return <Target className="w-5 h-5" />;
          }
        };

        return (
          <div key={course.id} className="border border-green-500/30 bg-green-950/20 p-6 rounded flex flex-col gap-4 hover:border-green-400 transition-colors relative h-full">
            {!course.available && (
               <div className="absolute top-4 right-4 bg-yellow-900/50 text-yellow-400 border border-yellow-500/30 text-xs px-2 py-1 rounded">
                   DRAFT
               </div>
            )}
            <div className="flex items-center justify-center p-4 bg-green-900/20 text-green-400 border border-green-500/20 rounded">
               {categoryIcon()}
            </div>
            
            <div>
              <h3 className="text-xl font-bold tracking-widest text-green-300">{title}</h3>
              <p className="text-sm text-green-500/80 mt-2 line-clamp-3 leading-relaxed">{desc}</p>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-green-500/20 text-sm">
              <span className="text-green-500/60 uppercase tracking-wider">{course.difficulty}</span>
              <span className="text-green-500/60">{course.hours} {language === "ar" ? "Ø³Ø§Ø¹Ø©" : "hours"}</span>
            </div>

            {user ? (
               <Link href={`/courses/${course.slug}`} className="block w-full bg-green-500/10 hover:bg-green-500/30 border border-green-500/50 text-center py-2 mt-2 rounded transition-colors text-green-300 font-bold uppercase tracking-widest">
                  {language === "ar" ? "Ø¹Ø±Ø¶ Ø§Ù„Ø¯ÙˆØ±Ø©" : "View Course"}
               </Link>
            ) : (
               <div className="flex items-center justify-center gap-2 w-full bg-black border border-green-500/20 text-green-600 py-2 mt-2 rounded uppercase tracking-widest text-sm">
                  <Lock className="w-4 h-4" />
                  {language === "ar" ? "ÙŠØ¬Ø¨ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„" : "Login Required"}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
