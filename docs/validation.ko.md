# 검증 상태

## 완료된 검증

- JSON 파싱: marketplace, plugin index, plugin manifest
- marketplace source와 plugin 디렉터리 일치
- plugin 이름과 버전 일치
- 스킬 이름·디렉터리·frontmatter 일치
- 에이전트 이름·파일명·frontmatter 일치
- 공개 component index와 실제 파일 일치
- 스킬 자동 호출 비활성화 확인
- 콘텐츠형 경계 확인: hooks, MCP, LSP, 실행 바이너리, npm 의존성 없음
- Node.js 정적 검증 스크립트와 GitHub Actions 구성

## 실제 Grok CLI로 확인한 검증

`grok` 0.2.112 (stable) 환경에서 직접 실행했습니다.

- `grok plugin validate plugins/oh-my-grok-build` → PASS (`1 skill dir(s), 0 command dir(s), 1 agent dir(s)`)
- `.grok-plugin/marketplace.json`과 `plugin-index.json` 스키마를 실제 `xai-official` 마켓플레이스 캐시와 필드 단위 대조
- README의 설치 명령(`grok plugin marketplace add` / `install --trust` / `enable` / `details`)이 `grok plugin --help`에 실존함을 확인
- 에이전트 frontmatter 필드를 공식 사용자 가이드 및 로컬 에이전트 정의와 대조. 이 과정에서 `permissionMode: acceptEdits`가 Grok Build에 존재하지 않는 값임을 발견하고 `auto`로 정정했습니다. 문서·실사용 근거가 없는 `promptMode`, `outputFormat`, `agentsMd`는 제거했습니다.
- GitHub 마켓플레이스 경로로 실제 설치: `grok plugin marketplace add duarbdhks/oh-my-grok-build` → `install --trust` → `enable` 전부 성공
- `grok inspect --json`으로 런타임 해석 확인
  - 스킬 6개가 모두 `userInvocable: true`로 등록됨 (슬래시 명령 호출 가능)
  - 에이전트 6개가 모두 `oh-my-grok-build:ogb-*` plugin-qualified 이름으로 등록됨 — 스킬이 참조하는 이름과 일치
- GitHub Actions `validate` 워크플로 통과

## 알려진 검증 한계

`grok plugin validate`는 `plugin.json` 매니페스트와 컴포넌트 디렉터리 존재만 검사하며, 스킬·에이전트 frontmatter의 의미론은 확인하지 않습니다. 즉 무효한 `permissionMode` 값이나 지원하지 않는 필드를 통과시킵니다.

따라서 frontmatter 정합성은 `npm test`(`scripts/validate.mjs`)가 담당합니다. 이 스크립트는 허용된 `permissionMode` 값 집합과 미지원 필드 부재를 검사합니다.

## 현재 환경에서 실행하지 못한 검증

설치와 컴포넌트 등록은 확인했지만, 아래는 실제 Grok 세션에서 스킬을 **실행**해야 확인되므로 여전히 미검증입니다.

- `/ogb-plan`, `/ogb-start`, `/ogb-ultrawork`, `/ogb-verify`, `/ogb-workflow`, `/ogb-doctor` 실제 호출과 결과
- plugin-qualified agent 이름으로 서브에이전트 생성
- worktree apply와 충돌 처리
- bundled `create-workflow`와 `check-work` 발견

## 실행 명령

```bash
npm test
npm run validate:grok
```

`npm run validate:grok`는 `grok` CLI가 없으면 정적 검증만 통과시키고 런타임 검증을 `SKIP`으로 표시합니다.
