import Link from "next/link";
import TopBar from "../components/TopBar";

const sources = [
  {
    title: "Participatory sensory-friendly design with autistic youth, families, and autistic mentors",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9254619/",
  },
  {
    title: "Systematic review of multisensory environments for autistic children and adults",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12255839/",
  },
  {
    title: "Assistive technology for autistic adults: user-centered design considerations",
    href: "https://pubmed.ncbi.nlm.nih.gov/38784821/",
  },
  {
    title: "Designing technology around routines, control, and spatial needs of autistic people",
    href: "https://www.sciencedirect.com/science/article/pii/S1071581918303859",
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 text-[#212529]">
        <section className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h1 className="text-3xl font-semibold text-[#2E5C8A]">Tafrah methodology</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#495057]">
            Tafrah is autism-first today. Our course design, preference wizard, and Nour AI support model are built from repeated surveys, interviews with autistic people, mentor reviews, expert feedback, and research on sensory processing, predictable routines, cognitive load, and assistive learning technology.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card title="Lived experience" text="We treat autistic learners as co-designers. Preferences are not decorative; they reflect sensory comfort, predictability, and control." />
          <Card title="Mentor and expert review" text="Course steps, quizzes, and feedback patterns are reviewed against practical teaching experience and autism-support methods." />
          <Card title="Research-informed UX" text="The platform favors calm color systems, reduced motion, short instructions, visible progress, and optional text-to-speech." />
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">How this affects the product</h2>
          <ul className="mt-4 list-disc space-y-2 ps-6 text-[#495057]">
            <li>Every student starts with a simple survey, then chooses sensory and reading preferences.</li>
            <li>The dashboard tracks course progress and quiz progress without overwhelming the learner.</li>
            <li>Course screens use one-step-at-a-time learning, predictable controls, and optional Nour assistance.</li>
            <li>Centers manage students and see statistics; students keep their own course access.</li>
            <li>CP and learning-difficulty support are in the pipeline and are clearly labeled as roadmap work.</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#D9E6F2] bg-[#F5F9FF] p-6">
          <h2 className="text-xl font-semibold text-[#2E5C8A]">Selected sources</h2>
          <div className="mt-4 grid gap-3">
            {sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-[#D9E6F2] bg-white p-4 text-[#2E5C8A] hover:underline">
                {source.title}
              </a>
            ))}
          </div>
        </section>

        <Link href="/auth/select" className="inline-flex min-h-12 w-fit items-center rounded-sm bg-[#2E5C8A] px-6 font-semibold text-white">
          Start with Tafrah
        </Link>
      </main>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-sm border border-[#D9E6F2] bg-white p-5">
      <h2 className="text-xl font-semibold text-[#2E5C8A]">{title}</h2>
      <p className="mt-2 leading-relaxed text-[#495057]">{text}</p>
    </article>
  );
}
