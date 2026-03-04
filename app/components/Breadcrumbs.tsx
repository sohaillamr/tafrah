import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items, ariaLabel }: { items: BreadcrumbItem[]; ariaLabel?: string }) {
  return (
    <nav aria-label={ariaLabel || "Breadcrumb"}>
      <ol className="flex flex-wrap items-center gap-2 text-[#212529]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="min-h-12 inline-flex items-center">
                {item.label}
              </Link>
            ) : (
              <span className="min-h-12 inline-flex items-center">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
