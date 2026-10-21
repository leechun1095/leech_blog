---
title: "Markdown으로 블로그 만들기"
date: "2026-10-21"
description: "Markdown 파일로 포스팅을 관리하는 방법을 소개합니다."
tags: ["Markdown", "블로그", "Next.js"]
slug: "markdown-blog"
---

데이터베이스나 CMS 없이도 블로그를 운영할 수 있습니다. 글을 `.md` 파일로 작성하고 저장소에 커밋하면 그것이 곧 발행입니다. 이 글에서는 그 구조를 간단히 정리합니다.

## 왜 Markdown인가

Markdown은 **읽기 쉬운 평문**이면서 동시에 구조화된 문서입니다. 어떤 에디터에서도 열 수 있고, Git으로 변경 이력을 추적할 수 있습니다.

- 도구에 종속되지 않습니다
- 버전 관리가 자연스럽습니다
- 코드 블록, 표, 인용 등 기술 글쓰기에 필요한 요소를 모두 지원합니다

## 디렉터리 구조

포스팅은 모두 `content/posts/` 아래에 둡니다.

```text
content/
  posts/
    markdown-blog.md
    frontmatter-guide.md
    reading-typography.md
```

### Frontmatter

각 파일의 맨 위에는 메타데이터를 YAML 형식으로 적습니다.

```yaml
---
title: "Markdown으로 블로그 만들기"
date: "2026-10-21"
tags: ["Markdown", "블로그"]
slug: "markdown-blog"
---
```

## 렌더링 파이프라인

본문은 `unified` 생태계를 이용해 HTML로 변환합니다.

| 단계 | 라이브러리 | 역할 |
| --- | --- | --- |
| 파싱 | remark-parse | Markdown → AST |
| 확장 | remark-gfm | 표, 체크리스트 지원 |
| 변환 | remark-rehype | Markdown AST → HTML AST |
| 마무리 | rehype-slug | 제목에 앵커 id 부여 |

> 파이프라인의 각 단계를 플러그인으로 교체할 수 있다는 점이 가장 큰 장점입니다.

## 마치며

이제 새 글을 쓰고 싶다면 파일 하나만 추가하면 됩니다. 다음 글에서는 [frontmatter를 설계하는 방법](/posts/frontmatter-guide)을 자세히 다룹니다.
