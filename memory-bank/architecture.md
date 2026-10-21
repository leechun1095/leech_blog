# 프로젝트 아키텍처

## 개요

이 저장소는 Next.js App Router와 React로 만든 파일 기반 Markdown 블로그입니다. 데이터베이스나 외부 CMS를 사용하지 않습니다. 게시물은 `content/posts/*.md` 파일로 관리하며, 서버 코드가 파일을 읽어 목록과 상세 페이지를 구성합니다.

기술 스택은 Next.js 16, React 19, TypeScript, pnpm, Tailwind CSS 4입니다. Markdown 메타데이터 파싱에는 `gray-matter`, 변환에는 `unified` 및 remark/rehype 플러그인을 사용합니다.

## 디렉터리 구조

```text
app/                    Next.js 라우트, 공통 레이아웃, 전역 스타일
  page.tsx              홈 및 게시물 목록
  posts/[slug]/page.tsx 게시물 상세 페이지
  layout.tsx            사이트 공통 레이아웃과 메타데이터
  globals.css           Tailwind 및 디자인 토큰
  not-found.tsx          404 페이지
components/             페이지에서 사용하는 UI 컴포넌트
  post-explorer.tsx      검색 및 태그 필터 (클라이언트 컴포넌트)
  post-card.tsx          게시물 목록 카드와 미리보기
  post-extras.tsx        목차 및 관련 글
  site-header.tsx        사이트 헤더와 푸터
  tag-list.tsx           태그 목록
  ui/                    공통 UI 요소
content/posts/           Frontmatter와 본문을 포함한 Markdown 게시물
lib/
  posts.ts               파일 읽기, 게시물 파싱, Markdown 렌더링
  utils.ts               클래스 이름 병합 유틸리티
public/                  아이콘과 정적 이미지
memory-bank/             프로젝트 컨텍스트 및 아키텍처 문서
```

## 게시물 데이터와 렌더링 흐름

1. `lib/posts.ts`가 `process.cwd()/content/posts`에서 `.md` 파일을 읽습니다.
2. `gray-matter`가 YAML Frontmatter와 Markdown 본문을 분리합니다. Frontmatter는 `title`, `date`, `description`, `tags`를 사용하며, 선택적으로 `slug`를 지정할 수 있습니다. `slug`를 생략하면 파일 이름을 사용합니다.
3. 허용되는 slug는 소문자 영문/숫자와 하이픈 형식입니다. 요약 데이터에는 발췌문, 검색용 텍스트, 예상 읽기 시간도 포함되고 게시 날짜 내림차순으로 정렬됩니다.
4. 홈 페이지(`app/page.tsx`)가 서버에서 게시물 요약과 태그를 준비해 `PostExplorer`에 전달합니다. 브라우저에서는 검색어와 선택한 태그로 목록을 필터링합니다. 태그 선택은 URL의 `?tag=` 쿼리에 반영됩니다.
5. 상세 페이지(`app/posts/[slug]/page.tsx`)는 `generateStaticParams()`로 게시물 slug를 만들고 `dynamicParams = false`로 등록된 게시물만 허용합니다. `getPostBySlug()`가 Markdown을 HTML로 변환하고 목차를 구성합니다.
6. Markdown 파이프라인은 `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-slug` → `rehype-highlight` → `rehype-stringify`입니다. 상세 페이지는 변환된 HTML, 목차, 태그, 관련 게시물을 보여줍니다.

`getRawPosts`에는 React `cache`가 적용되어 동일한 서버 렌더링 중 중복 파일 읽기를 줄입니다. 별도의 영구 저장소나 API 서버는 없습니다.

## 라우트와 UI 구성

- `/`: 제목, 소개, 게시물 검색, 태그 필터, 게시물 카드 목록
- `/posts/[slug]`: 게시물 본문, 메타데이터, 목차, 관련 게시물
- 잘못되었거나 없는 경로: `app/not-found.tsx`
- `app/layout.tsx`: 한국어 문서 언어, 폰트, 헤더/푸터, SEO 메타데이터 및 프로덕션 Vercel Analytics

`components/post-explorer.tsx`와 `components/post-card.tsx`는 클라이언트 컴포넌트이며, 라우트 페이지와 나머지 컴포넌트는 기본적으로 서버 컴포넌트입니다.

## 개발 및 설정

`package.json` 스크립트:

- `pnpm dev`: 로컬 개발 서버
- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 빌드된 앱 실행

`@/*` 별칭은 저장소 루트 기준으로 설정되어 있습니다. `next.config.mjs`에서 이미지 최적화를 비활성화했고 TypeScript 빌드 오류를 무시하도록 설정되어 있습니다.

## 콘텐츠 추가

새 게시물은 `content/posts/<slug>.md`에 추가합니다. 파일에는 YAML Frontmatter와 Markdown 본문을 작성합니다. 등록된 slug를 Next.js가 정적 게시물 경로 생성에 사용하므로 게시물 추가 후 개발 서버를 다시 시작하거나 새 빌드를 생성해야 콘텐츠가 경로에 포함됩니다.
