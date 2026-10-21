import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-start px-5 pt-24">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
        포스팅을 찾을 수 없습니다
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        요청한 주소의 글이 없거나 삭제되었습니다. 주소를 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        전체 포스팅 보기
      </Link>
    </main>
  )
}
