const fs = require('fs');
let code = fs.readFileSync('app/courses/[id]/learn/page.tsx', 'utf8');

code = code.replace(
  '  params: Promise<{ id: string }>;',
  '  params: Promise<{ id: string }>;\n  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;'
);

code = code.replace(
  'export default async function CourseLearnPage(props: PageProps) {\n  const { id } = await props.params;',
  'export default async function CourseLearnPage(props: PageProps) {\n  const [ { id }, searchParams ] = await Promise.all([\n    props.params,\n    props.searchParams\n  ]);'
);

code = code.replace(
  '  if (!course || course.isArchived) {\n    notFound();\n  }',
  '  if (!course || course.isArchived) {\n    notFound();\n  }\n\n  const isAdmin = session.role === \'admin\' || session.role === \'supreme_admin\';\n  if (!isAdmin) {\n    const enrollment = await prisma.enrollment.findFirst({\n      where: { courseId: course.id, userId: session.userId }\n    });\n    if (!enrollment) {\n      return <div className=\\'flex h-screen items-center justify-center\\'><h1 className=\\'text-xl text-[#2e5c8a]\\'>Not enrolled. Please enroll to access this course.</h1></div>;\n    }\n  }'
);

code = code.replace(
  '  const activeUnit = 0;',
  '  const unitParam = searchParams.unit;\n  const activeUnit = unitParam && !Array.isArray(unitParam) ? parseInt(unitParam, 10) : 0;'
);

code = code.replace(
  '<div>Content unavailable.</div>',
  '<div className=\\'p-8 text-center text-xl font-bold\\'>Content unavailable for unit {activeUnit}.</div>'
);

// fix windows newlines
code = code.replace(/\r\n/g, '\n');

fs.writeFileSync('app/courses/[id]/learn/page.tsx', code, 'utf8');

