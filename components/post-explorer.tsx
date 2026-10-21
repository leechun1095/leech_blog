'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { PostCard } from '@/components/post-card'
import type { PostSummary } from '@/lib/posts'

type Props = {
  posts: (PostSummary & { formattedDate: string })[]
  tags: string[]
}

export function PostExplorer({ posts, tags }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (activeTag && !post.tags.includes(activeTag)) return false
      if (keyword && !post.searchText.includes(keyword)) return false
      return true
    })
  }, [posts, query, activeTag])

  function selectTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) params.set('tag', tag)
    else params.delete('tag')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <section aria-labelledby="posts-heading">
      <h2 id="posts-heading" className="sr-only">
        포스팅 목록
      </h2>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="post-search" className="sr-only">
            포스팅 검색
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="post-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 요약, 본문 검색"
            className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="검색어 지우기"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
          <FilterChip active={!activeTag} onClick={() => selectTag(null)}>
            전체
          </FilterChip>
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              active={activeTag === tag}
              onClick={() => selectTag(activeTag === tag ? null : tag)}
            >
              #{tag}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length}개의 포스팅
      </p>

      {filtered.length > 0 ? (
        <div className="divide-y divide-border">
          {filtered.map(({ formattedDate, ...post }) => (
            <PostCard key={post.slug} post={post} formattedDate={formattedDate} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="font-medium">검색 결과가 없습니다.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            다른 검색어를 입력하거나 태그 필터를 해제해 보세요.
          </p>
        </div>
      )}
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
