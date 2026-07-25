# 검증 상태

[English](validation.md)

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
- 실제 Grok 세션에서 `/ogb-doctor` 실행. 스킬·에이전트 디스커버리, Plan mode, subagents, worktree, `create-workflow`, `check-work` 전부 PASS. 이 실행으로 컴포넌트 이름 규약 결함 2건을 발견해 수정했습니다(아래 참조).

### `/ogb-doctor` 실행으로 발견한 결함

Grok은 플러그인 에이전트를 `oh-my-grok-build:<agent>`로 등록하지만 스킬은 bare name을 유지합니다.

- `ogb-doctor`가 존재하지 않는 bare 에이전트 이름(`ogb-planner` 등)을 확인하도록 지시하고 있었습니다.
- `ogb-start`가 `ogb-verify` **스킬**을 에이전트 문법(`oh-my-grok-build:ogb-verify`)으로 참조하고 있었습니다.

둘 다 수정했고, `scripts/validate.mjs`가 실제 에이전트가 아닌 qualified 참조를 거부하도록 검사를 추가했습니다.

## 알려진 검증 한계

`grok plugin validate`는 `plugin.json` 매니페스트와 컴포넌트 디렉터리 존재만 검사하며, 스킬·에이전트 frontmatter의 의미론은 확인하지 않습니다. 즉 무효한 `permissionMode` 값이나 지원하지 않는 필드를 통과시킵니다.

따라서 frontmatter 정합성은 `npm test`(`scripts/validate.mjs`)가 담당합니다. 이 스크립트는 허용된 `permissionMode` 값 집합과 미지원 필드 부재를 검사합니다.

`scripts/validate.mjs`에도 한계가 있습니다. 컴포넌트 이름 검사는 **단방향**입니다.

- 잡습니다: SKILL.md의 `oh-my-grok-build:<이름>` 참조가 실제 에이전트가 아닌 경우
- 못 잡습니다: 에이전트를 prefix 없이 bare 이름으로 spawn하도록 지시하는 경우

후자는 산문 속 bare `ogb-executor`가 파일 언급과 구분되지 않아 오탐이 발생하므로 정적으로 검출하지 않습니다. 대신 `ogb-start`와 `ogb-ultrawork`의 spawn shape 블록으로 올바른 형식을 고정하고, 실제 세션의 `/ogb-doctor`로 확인합니다.

## 스킬 6개 라이브 실행 검증

`grok` 0.2.112 headless(`grok -p`)로 스킬 6개를 전부 실행했습니다. 쓰기 스킬 3개는 임시 git 저장소에서 격리 실행했습니다.

| 스킬 | 판정 | 증거 |
|---|---|---|
| `/ogb-doctor` | PASS | 스킬 6개·에이전트 6개 등록 확인, Plan mode·subagents·worktree·`create-workflow`·`check-work` 전부 사용 가능 |
| `/ogb-plan` | PASS | Planner → Architect(REVISE) → Critic(APPROVE) 합의 루프 완주, 소스 미수정 |
| `/ogb-ultrawork` | PASS | `oh-my-grok-build:ogb-executor` 2개가 worktree 격리로 병렬 실행 후 통합, 대상 2파일만 변경 |
| `/ogb-start` | PASS | worktree executor 2개, 런타임 수용 기준 충족(`subtract(5,2)`→`3`, `trim`→`"x"`), 기존 export 회귀 없음, commit·push 안 함 |
| `/ogb-verify` | PASS | `ogb-verifier`와 bundled `check-work` 독립 실행, 검증 세션 중 파일 수정 0건 |
| `/ogb-workflow` | PASS | Rhai 워크플로 작성 후 `validate_only: true`로 메타데이터·컴파일·대표 args 통과 |

이 실행으로 다음이 함께 확인되었습니다.

- plugin-qualified 이름(`oh-my-grok-build:ogb-*`)으로 서브에이전트가 실제로 생성됨
- worktree apply가 충돌 없이 통합됨
- bundled `create-workflow`와 `check-work`가 발견·사용됨

## 남은 미검증

- worktree 병합 **충돌** 처리 경로. 위 실행은 파일 소유권이 겹치지 않아 충돌이 발생하지 않았습니다.
- 작성된 워크플로의 라이브 실행. `validate_only`는 메타데이터·컴파일·대표 args 경로 하나만 증명하며, 인자 누락·예산 소진·병렬 슬롯 실패 분기는 미검증입니다.

## 실행 명령

```bash
npm test
npm run validate:grok
```

`npm run validate:grok`는 `grok` CLI가 없으면 정적 검증만 통과시키고 런타임 검증을 `SKIP`으로 표시합니다.
