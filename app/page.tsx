import { Suspense } from 'react'
import { PostExplorer } from '@/components/post-explorer'
import { formatDate, getAllPosts, getAllTags } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts().map((post) => ({ ...post, formattedDate: formatDate(post.date) }))
  const tags = getAllTags()

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-14 sm:pt-20">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          My Markdown Blog
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          Markdown 파일로 작성하고 관리하는 기록들. 개발, 글쓰기, 디자인에 관한 생각을 남깁니다.
        </p>
      </header>
      <Suspense>
        <PostExplorer posts={posts} tags={tags} />
      </Suspense>
    </main>
  )
}
