import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { SITE_BASE_PATH } from '@/lib/site'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type PostMeta = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

export type PostSummary = PostMeta & {
  excerpt: string
  searchText: string
  readingMinutes: number
}

export type TocItem = {
  id: string
  text: string
  depth: 2 | 3
}

export type Post = PostSummary & {
  html: string
  toc: TocItem[]
}

type RawPost = PostSummary & { content: string }

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value
  return ''
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~|]/g, '')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function createExcerpt(plain: string, length = 220): string {
  if (plain.length <= length) return plain
  return `${plain.slice(0, length).trimEnd()}…`
}

function readRawPosts(): RawPost[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file): RawPost | null => {
      const source = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
      const { data, content } = matter(source)
      const fileSlug = file.replace(/\.md$/, '').toLowerCase()
      const slug =
        typeof data.slug === 'string' && data.slug.trim() ? data.slug.trim() : fileSlug

      if (!SLUG_PATTERN.test(slug)) return null

      const plain = stripMarkdown(content)
      const title = typeof data.title === 'string' ? data.title : slug
      const description = typeof data.description === 'string' ? data.description : ''
      const tags = Array.isArray(data.tags) ? data.tags.map(String) : []

      return {
        slug,
        title,
        date: normalizeDate(data.date),
        description,
        tags,
        excerpt: createExcerpt(plain),
        searchText: `${title} ${description} ${plain}`.toLowerCase(),
        readingMinutes: Math.max(1, Math.round(plain.length / 500)),
        content,
      }
    })
    .filter((post): post is RawPost => post !== null)

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

const getRawPosts = cache(readRawPosts)

export function getAllPosts(): PostSummary[] {
  return getRawPosts().map(({ content: _content, ...summary }) => summary)
}

export function getAllTags(): string[] {
  const counts = new Map<string, number>()
  for (const post of getRawPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
}

function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '')
  const toc: TocItem[] = []

  for (const line of withoutCode.split('\n')) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue
    const depth = match[1].length
    const text = stripMarkdown(match[2])
    const id = slugger.slug(text)
    if (depth === 2 || depth === 3) toc.push({ id, text, depth })
  }
  return toc
}

async function renderMarkdown(markdown: string): Promise<string> {
  const content = SITE_BASE_PATH
    ? markdown.replace(/\]\(\/posts\//g, `](${SITE_BASE_PATH}/posts/`)
    : markdown
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false })
    .use(rehypeStringify)
    .process(content)
  return String(file)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!SLUG_PATTERN.test(slug)) return null
  const raw = getRawPosts().find((post) => post.slug === slug)
  if (!raw) return null

  const { content, ...summary } = raw
  return {
    ...summary,
    html: await renderMarkdown(content),
    toc: extractToc(content),
  }
}

export function getRelatedPosts(slug: string, limit = 3): PostSummary[] {
  const posts = getAllPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current) return []

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      shared: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(({ post }) => post)
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}
