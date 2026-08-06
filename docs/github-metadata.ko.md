# GitHub 저장소 메타데이터 (소유자 체크리스트)

[English](github-metadata.md)

첫인상과 검색 노출을 위한 설정입니다. **대부분은 GitHub UI 또는 소유자 권한의 `gh`가 필요합니다.** 여기 체크리스트를 적어 두었다고 GitHub.com에 이미 적용된 것은 아닙니다.

## 권장 description

```text
Native-first Grok Build plugin: consensus planning, bounded parallel execution, independent verification — no second runtime.
```

## Website URL

```text
https://github.com/duarbdhks/oh-my-grok-build
```

문서 사이트는 유지 비용이 정당할 때만. v0.1은 README + `docs/`로 충분합니다.

## Topics

사실에 맞는 것만:

- `grok-build`
- `grok`
- `ai-agents`
- `agent-orchestration`
- `developer-tools`
- `workflow`
- `planning`
- `verification`

정확하면 선택: `multi-agent`, `worktree`. xAI 공식 소유처럼 보이는 토픽은 피하세요.

## 소셜 프리뷰 이미지

업로드:

```text
assets/brand/oh-my-grok-build-social-preview.png
```

크기 1200×630. 소스 SVG: `assets/brand/social-preview.svg`.

GitHub UI: Repository → Settings → General → Social preview.

## Issue 템플릿

v0.1에 필수는 아님. 권장:

- 버그: Grok Build 버전, 설치 경로, `/ogb-doctor` 출력, 재현
- 스킬 동작: 명령, 기대/실제, 소스 수정 여부
- 문서: 페이지 경로, 깨진 링크 또는 불명확한 단계

## PR 템플릿

권장 체크리스트:

- [ ] 네이티브 우선: session/goal/worktree/workflow 런타임 재구현 없음
- [ ] 문서 변경 시 EN/KO 쌍 갱신
- [ ] `npm test` 통과
- [ ] 검증 주장이 `docs/validation.md`와 일치 (증거 없는 신규 라이브 주장 금지)
- [ ] 스킬에 요청 없는 commit/push/PR 자동화 없음

## Discussions

선택. 이슈 노이즈가 늘면 Q&A용. 콘텐츠 전용 플러그인에 필수는 아님.

## 릴리스 노트

[CHANGELOG.md](../CHANGELOG.md)를 따르세요. [로드맵](roadmap.ko.md) 라이브 검증 게이트 후 `plugin.json` 버전으로 태그하세요. 스킬/에이전트 추가, 검증 범위, 제한을 사실대로 적으세요.

## GitHub Pages / 외부 문서 사이트

v0.1에 불필요. README에서 연결하는 저장소 내 `docs/` 쌍을 우선하세요. 탐색 비용이 커질 때만 재검토하세요.
