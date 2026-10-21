'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TagList } from '@/components/tag-list'
import type { PostSummary } from '@/lib/posts'

export function PostCard({ post, formattedDate }: { post: PostSummary; formattedDate: string }) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const previewId = `preview-${post.slug}`

  return (
    <article className="group relative flex flex-col gap-3 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <time dateTime={post.date}>{formattedDate}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes}분 읽기</span>
      </div>

      <h2 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-balance">
        <Link
          href={`/posts/${post.slug}`}
          className="decoration-primary/40 underline-offset-4 group-hover:underline"
        >
          {post.title}
        </Link>
      </h2>

      {post.description && (
        <p className="leading-relaxed text-muted-foreground text-pretty">{post.description}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TagList tags={post.tags} />
        <button
          type="button"
          onClick={() => setPreviewOpen((open) => !open)}
          aria-expanded={previewOpen}
          aria-controls={previewId}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {previewOpen ? '미리보기 닫기' : '미리보기'}
          <ChevronDown
            className={`size-4 transition-transform ${previewOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id={previewId}
        hidden={!previewOpen}
        className="rounded-lg border-l-2 border-primary/40 bg-muted/60 px-4 py-3"
      >
        <p className="text-sm leading-relaxed text-foreground/80 [word-break:keep-all]">
          {post.excerpt}
        </p>
        <Link
          href={`/posts/${post.slug}`}
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          계속 읽기 →
        </Link>
      </div>
    </article>
  )
}
