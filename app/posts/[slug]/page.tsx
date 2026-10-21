import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { TagList } from '@/components/tag-list'
import { RelatedPosts, TableOfContents } from '@/components/post-extras'
import { formatDate, getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: '포스팅을 찾을 수 없습니다' }
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post.slug)

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pt-10 sm:pt-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        전체 포스팅
      </Link>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-14">
        <article className="min-w-0">
          <header className="mb-10 border-b border-border pb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes}분 읽기</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
                {post.description}
              </p>
            )}
            <div className="mt-5">
              <TagList tags={post.tags} linked />
            </div>
          </header>

          {post.toc.length > 0 && (
            <details className="mb-10 rounded-lg border border-border bg-card p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-medium">목차 보기</summary>
              <div className="mt-4">
                <TableOfContents items={post.toc} />
              </div>
            </details>
          )}

          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />

          <RelatedPosts posts={related} currentTags={post.tags} />

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              목록으로 돌아가기
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <TableOfContents items={post.toc} />
          </div>
        </aside>
      </div>
    </main>
  )
}
