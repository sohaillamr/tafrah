"use client";
 
 import TopBar from "../components/TopBar";
 import Breadcrumbs from "../components/Breadcrumbs";
 import { useLanguage } from "../components/LanguageProvider";
 
 export default function AboutPage() {
   const { language } = useLanguage();
   const labels =
     language === "ar"
       ? {
           home: "الرئيسية",
           about: "من نحن",
           title: "عن طفرة",
           intro:
             "طفرة منصة تدريبية ومهنية تساعد المتدربين على اكتساب مهارات عملية واضحة في بيئة منظمة وسهلة الاستخدام.",
           missionTitle: "رسالتنا",
           mission:
             "تقديم تجربة تعلم مبنية على خطوات قصيرة وواضحة، مع تركيز على الدقة والاعتماد على الذات والاستعداد لسوق العمل.",
           valuesTitle: "قيمنا",
           values: [
             "الوضوح: تعليمات مباشرة وخطوة واحدة في كل مرة.",
             "التنظيم: محتوى مرتب يقلل التشتيت.",
             "الدقة: تدريب على جودة التنفيذ.",
           ],
           audienceTitle: "لمن هذه المنصة؟",
           audience:
             "للمتدربين الذين يفضلون التعلم المنظم والمهام الواضحة، ولمؤسسات تبحث عن كوادر مدربة على مهارات إدخال البيانات والعمل الرقمي.",
         }
       : {
           home: "Home",
           about: "About us",
           title: "About Tafrah",
           intro:
             "Tafrah is a training and career platform that helps learners build clear, practical skills in a structured and easy-to-use environment.",
           missionTitle: "Our mission",
           mission:
             "Deliver learning journeys built on short, clear steps with a focus on accuracy, independence, and job readiness.",
           valuesTitle: "Our values",
           values: [
             "Clarity: direct instructions and one step at a time.",
             "Structure: organized content that reduces distraction.",
             "Accuracy: training for quality execution.",
           ],
           audienceTitle: "Who is it for?",
           audience:
             "Learners who prefer structured training and clear tasks, and organizations seeking talent trained in data entry and digital work.",
         };
 
   return (
     <div className="min-h-screen">
       <TopBar />
       <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
         <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.about }]} />
 
         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h1 className="font-semibold">{labels.title}</h1>
           <p>{labels.intro}</p>
         </section>
 
         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold">{labels.missionTitle}</h2>
           <p>{labels.mission}</p>
         </section>
 
         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold">{labels.valuesTitle}</h2>
           <ul className="list-inside list-disc">
             {labels.values.map((value) => (
               <li key={value}>{value}</li>
             ))}
           </ul>
         </section>
 
         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold">{labels.audienceTitle}</h2>
           <p>{labels.audience}</p>
         </section>
       </main>
     </div>
   );
 }
