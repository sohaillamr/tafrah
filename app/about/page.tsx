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
             "طفرة هي أول منظومة تقنية تكيفية في المنطقة العربية تستهدف سد الفجوة المهنية للأفراد من ذوي التوحد، الشلل الدماغي، وصعوبات التعلم.",
           missionTitle: "رسالتنا: العدالة الرقمية الشاملة",
           mission:
             "نطمح لتحقيق العدالة الرقمية الشاملة (Universal Digital Equity) من خلال توفير بنية تحتية تعليمية تتكيف مع القدرات الإدراكية والحركية لكل فرد.",
           valuesTitle: "التأثير والامتداد",
           values: [
             "جسر تواصل: نربط بين وزارة التضامن الاجتماعي، ومراكز التأهيل، والشركات الكبرى.",
             "تمكين مهني لا شفقة: نركز على كفاءة الفرد وقدرته على تقديم قيمة حقيقية في سوق العمل.",
             "مسار حصة الـ 5%: نوفر قناة مباشرة لتساند المؤسسات في تفعيل حصص التوظيف القانونية بأفضل الكفاءات."
           ],
           audienceTitle: "لمن هذه المنظومة؟",
           audience:
             "للمؤسسات الساعية لتحقيق الدمج والعدالة المجتمعية، ولذوي التنوع العصبي والحركي الباحثين عن فرص عمل مدعومة بذكاء اصطناعي تكيفي (Nour AI) يراعي الاحتياجات الحسية والمعرفية."
         }
       : {
           home: "Home",
           about: "About us",
           title: "About Tafrah",
           intro:
             "Tafrah is the region's first Universal Neuro-Adaptive Ecosystem designed to bridge the professional gap for individuals with Autism, Cerebral Palsy (CP), and Learning Disabilities.",
           missionTitle: "Our Mission: Universal Digital Equity",
           mission:
             "We strive to achieve Universal Digital Equity by providing an educational infrastructure that adapts to the cognitive, sensory, and motor needs of each user.",
           valuesTitle: "Impact & Reach",
           values: [
             "A Multi-Disciplinary Bridge: Connecting the Ministry of Social Solidarity, rehabilitation centers, and the corporate world to serve a broader spectrum of special needs.",
             "Professional Empowerment: Focusing on enablement and measurable skills, moving beyond charitable support.",
             "The 5% Pathway: Directly integrating specialized training with mandatory employment quotas in the banking and corporate sectors."
           ],
           audienceTitle: "Who is this ecosystem for?",
           audience:
             "For neurodivergent individuals and those with physical learning barriers seeking accessible AI-driven environments, and for forward-thinking organizations looking to build truly inclusive talent pipelines."
         };

   return (
     <div className="min-h-screen">
       <TopBar />
       <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#212529]">
         <Breadcrumbs items={[{ label: labels.home, href: "/" }, { label: labels.about }]} />
         
         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h1 className="font-semibold text-xl">{labels.title}</h1>
           <p>{labels.intro}</p>
         </section>

         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold text-[#2E5C8A] text-lg">{labels.missionTitle}</h2>
           <p>{labels.mission}</p>
         </section>

         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold text-[#2E5C8A] text-lg">{labels.valuesTitle}</h2>
           <ul className="list-inside list-disc space-y-2">
             {labels.values.map((value) => (
               <li key={value}>{value}</li>
             ))}
           </ul>
         </section>

         <section className="flex flex-col gap-4 rounded-sm border border-[#DEE2E6] bg-white p-6">
           <h2 className="font-semibold text-[#2E5C8A] text-lg">{labels.audienceTitle}</h2>
           <p>{labels.audience}</p>
         </section>
       </main>
     </div>
   );
 }
