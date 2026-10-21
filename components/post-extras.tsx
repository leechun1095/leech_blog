import Link from 'next/link'
import { TagList } from '@/components/tag-list'
import { formatDate, type PostSummary, type TocItem } from '@/lib/posts'

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null
  return (
    <nav aria-labelledby="toc-heading" className="text-sm">
      <h2
        id="toc-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        목차
      </h2>
      <ol className="flex flex-col gap-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? 'pl-7' : 'pl-4'}>
            <a
              href={`#${item.id}`}
              className="-ml-px block leading-snug text-muted-foreground transition-colors hover:text-primary"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function RelatedPosts({ posts, currentTags }: { posts: PostSummary[]; currentTags: string[] }) {
  if (posts.length === 0) return null
  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="related-heading" className="font-serif text-xl font-semibold tracking-tight">
        연관 포스팅
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => {
          const shared = post.tags.filter((tag) => currentTags.includes(tag))
          return (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <time dateTime={post.date} className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </time>
                <span className="font-serif text-lg font-semibold leading-snug">{post.title}</span>
                <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
                {shared.length > 0 && (
                  <span className="mt-auto pt-2">
                    <TagList tags={shared} />
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
