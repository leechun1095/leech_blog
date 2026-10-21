import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-foreground"
        >
          My Markdown Blog
        </Link>
        <nav aria-label="주요 메뉴">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            전체 포스팅
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>{'© 2026 My Markdown Blog'}</p>
        <p>
          <code className="font-mono text-xs">content/posts/*.md</code>로 작성되었습니다.
        </p>
      </div>
    </footer>
  )
}
