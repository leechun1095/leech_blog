import Link from 'next/link'

export function TagList({ tags, linked = false }: { tags: string[]; linked?: boolean }) {
  if (tags.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="태그">
      {tags.map((tag) => (
        <li key={tag}>
          {linked ? (
            <Link
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              #{tag}
            </Link>
          ) : (
            <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              #{tag}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
