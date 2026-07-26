# 검증 상태

[English](validation.md)

> 아래 `0.1.0` 섹션의 개수는 스킬 6개를 제공하던 그 릴리스의 라이브 실행 기준입니다. `/ogb-interview`는 그 이후에 추가되었고 [별도 섹션](#ogb-interview-라이브-실행-검증)에서 따로 검증합니다.
>
> 이 실행들 이후 에이전트 이름이 바뀌었습니다. `oh-my-grok-build:` 한정자가 이미 네임스페이스 역할을 하므로 `ogb-planner`는 `planner`가 되었고, 나머지 다섯 개도 같습니다. 아래에 기록된 `ogb-*` 에이전트 이름은 당시 실제로 실행된 내용을 서술하므로 그대로 둡니다. 새 이름으로의 등록은 별도로 재확인했으며, 아래 CLI 섹션에 있습니다.

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
- 에이전트 이름 변경 후 라이브 등록 확인. `grok plugin update oh-my-grok-build` 실행 후 `grok inspect --json`이 6개를 모두 `oh-my-grok-build:planner`, `:architect`, `:critic`, `:explorer`, `:executor`, `:verifier`로 나열합니다. 같은 실행에서 `~/.claude/agents/`의 동명 사용자 에이전트 5개(`planner`, `architect`, `critic`, `executor`, `verifier`)도 나란히 등록되어 있으며, 양쪽 어느 쪽도 상대를 밀어내지 않습니다. 한정된 이름이 레지스트리 키이므로 짧은 에이전트 이름은 안전합니다. 한정되지 않은 참조는 사용자 쪽 에이전트로 가며, 이를 잡으려고 validator 규칙과 `/ogb-doctor` 경고가 존재합니다.
- 그 설치본에 대해 `/ogb-doctor`를 headless로 재실행: 종합 PASS, FAIL 0건. 스킬 7개와 qualified 에이전트 6개를 모두 해석했고, 새 shadowing 체크가 설계대로 작동했습니다. bare 에이전트 이름을 "없는 것이 정상"으로 취급하는 대신, `~/.claude/agents/`의 동명 정의 5개를 파일명까지 짚어 `WARN`으로 보고했습니다. 같은 실행에서 나온 무관한 관찰 하나: `inspect`의 `provides.agents`가 실제 등록 6개인데 1로 나옵니다. 이 필드가 에이전트가 아니라 에이전트 디렉터리를 세기 때문이며, 이름 변경 이전부터 그랬고 `grok plugin validate`의 `1 agent dir(s)` 출력과 일치합니다.
- 실제 Grok 세션에서 `/ogb-doctor` 실행. 스킬·에이전트 디스커버리, Plan mode, subagents, worktree, `create-workflow`, `check-work` 전부 PASS. 이 실행으로 컴포넌트 이름 규약 결함 2건을 발견해 수정했습니다(아래 참조).

### `/ogb-doctor` 실행으로 발견한 결함

Grok은 플러그인 에이전트를 `oh-my-grok-build:<agent>`로 등록하지만 스킬은 bare name을 유지합니다.

- `ogb-doctor`가 존재하지 않는 bare 에이전트 이름(`ogb-planner` 등)을 확인하도록 지시하고 있었습니다.
- `ogb-start`가 `ogb-verify` **스킬**을 에이전트 문법(`oh-my-grok-build:ogb-verify`)으로 참조하고 있었습니다.

둘 다 수정했고, `scripts/validate.mjs`가 실제 에이전트가 아닌 qualified 참조를 거부하도록 검사를 추가했습니다.

## 알려진 검증 한계

`grok plugin validate`는 `plugin.json` 매니페스트와 컴포넌트 디렉터리 존재만 검사하며, 스킬·에이전트 frontmatter의 의미론은 확인하지 않습니다. 즉 무효한 `permissionMode` 값이나 지원하지 않는 필드를 통과시킵니다.

따라서 frontmatter 정합성은 `npm test`(`scripts/validate.mjs`)가 담당합니다. 이 스크립트는 허용된 `permissionMode` 값 집합과 미지원 필드 부재를 검사합니다.

`scripts/validate.mjs`는 컴포넌트 이름을 양방향으로 검사합니다. 스킬이 제공하는 모든 마크다운 파일, 즉 `SKILL.md`와 `references/` 아래 전부에 다음 세 규칙을 적용합니다. 참조 파일도 스킬이 로드하는 순간 지시문이 되기 때문입니다.

- **규칙 0** — `oh-my-grok-build:<이름>` 참조는 실제 에이전트를 가리켜야 합니다. 스킬을 에이전트 문법으로 참조한 경우를 잡습니다.
- **규칙 A** — 모든 `subagent_type:` 값은 한정된 이름이면서 실제 에이전트여야 합니다. 가장 중요한 규칙입니다. `ogb-start`와 `ogb-ultrawork`의 spawn shape는 fenced text 블록 안에 있어 다른 규칙으로는 보이지 않습니다.
- **규칙 B** — `` `executor` ``처럼 백틱으로 감싼 bare 에이전트 이름은 실패합니다. 백틱이 경계입니다. 백틱으로 감싼 bare 이름은 언제나 식별자이며 언제나 잘못된 형태입니다.

새 규칙 두 개는 각각 결함을 의도적으로 넣어 non-zero 종료를 확인한 뒤 되돌리는 방식으로 실제 동작을 검증했습니다.

여전히 정적으로 검출하지 못하는 것: 백틱도 `subagent_type:` 키도 없는 순수 산문 속의 bare 에이전트 이름을 모델이 그대로 실행하는 경우. 이를 매칭하면 평범한 영어 문장에서 오탐이 납니다. "the executor reports its evidence"는 정상적인 문장입니다. 이 공백은 예전보다 중요해졌습니다. 이제 bare `executor`는 실패하는 대신 사용자 환경의 동명 에이전트로 해석되기 때문입니다. `/ogb-doctor`가 그런 동명 에이전트를 경고로 보고하며, 실제 세션 실행이 최종 방어선으로 남습니다.

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

## `/ogb-interview` 라이브 실행 검증

`/ogb-interview`는 위 `0.1.0` 실행 이후에 추가되어 별도로 검증했습니다. `grok` 0.2.112 headless(`grok -p`)로, 라우트 2개짜리 Express 앱(`src/server.js`, `package.json`, 인증·기존 rate limit 없음)만 있는 임시 git 저장소에서 실행했습니다.

| 검사 | 판정 | 증거 |
|---|---|---|
| 등록 | PASS | `grok inspect --json`에 `ogb-interview`가 플러그인 소스로 `userInvocable: true` 등록 |
| 매니페스트 | PASS | `grok plugin validate plugins/oh-my-grok-build`가 추가된 스킬 디렉터리를 포함해 유효 판정 |
| 스코프 형태 게이트 | PASS | Round 0에서 저장소를 먼저 읽고 `src/server.js`·`package.json`을 인용, 상위 컴포넌트 4개 제시 후 확인 질문 1개만 제시 |
| 질문보다 증거 우선 | PASS | 미들웨어·인증·rate limit 부재를 먼저 확인한 뒤 질문, 코드가 답하는 내용을 사용자에게 되묻지 않음 |
| 인터뷰 루프 | PASS | 컴포넌트별 `CLEAR`/`PARTIAL`/`UNKNOWN` 준비도 표 보고, 병목 쌍(`rate limit policy` × `Goal`)과 한 문장 근거 지목, 질문 1개 유지 |
| 추천 답 제시 | PASS | 모든 질문에 근거 붙은 추천 답, 번호 대안, 자유 입력 옵션 동반 |
| 읽기 전용 경계 | PASS | 두 실행 후 `git status --short --branch` 깨끗, plan 생성·커밋·의존성 설치 없음 |

실행은 두 번입니다. 하나는 콜드 스타트, 하나는 확정된 컴포넌트와 Round 0 답변을 인자로 다시 붙여 넣은 실행으로, 상태 파일 없이 재개하는 문서화된 방식입니다.

## 한 세션 안에서의 전체 체인 실행

위의 검증은 모두 스킬 하나씩을 각각 별도 headless 실행으로 확인한 것입니다. 이번에는 `/ogb-interview`부터 `/ogb-verify`까지를 하나의 대화형 Grok Build 세션 안에서 연속으로 실행했고, 모든 스킬이 문서대로 동작했습니다.

개별 실행이 덮지 못하던 것은 **이음새**입니다. 인터뷰가 만든 브리프가 `/ogb-plan`으로 넘어가고, 승인된 계획이 다시 설명하지 않아도 `/ogb-start`에 전달되며, `/ogb-verify`가 같은 수용 기준으로 마무리되는 부분입니다.

또한 이 실행은 한 세션 안에 머물렀습니다. 이것이 지원되는 경로입니다. 계획은 새 세션으로 넘어가지 않으며, 아래 미검증 항목을 참고하세요.

## `/ogb-ultrawork` 스케줄링 시나리오 매핑

각 행을 `ogb-ultrawork` `SKILL.md`에서 그것을 지배하는 규칙과 대조합니다. 위의 이름 규칙이 정확한 메커니즘을 인용하는 것과 같은 방식입니다. 시나리오 A, C, D, E, F는 다음 절에 라이브 headless 증거가 있습니다. B와 B2만 설계 매핑으로 남습니다.

| 시나리오 | 기대 동작 | 지배 규칙 | 라이브 |
|---|---|---|---|
| A — 독립 3개 패키지 수정 | 같은 Wave, 한 배치로 일괄 시작 | Protocol step 5 (launch together) | PASS (아래) |
| B — 동일 schema/config 파일을 둘 다 쓰는 작업 | 같은 Wave에 두지 않음 (동일 파일 소유 금지) | Protocol step 4 (never same file) | 정적만 |
| B2 — schema/자원을 공유하되 쓰는 파일은 서로 다른 작업 | 동시성을 2까지 낮춘 경우에만 같은 Wave 허용 | Protocol step 3 | 정적만 |
| C — 독립적인 파일 검색과 설정 읽기 | 하나의 병렬 read-only 배치 | Protocol step 1 (조사 일괄 실행) | PASS (아래) |
| D — 동일 database와 port를 공유하는 integration test | 무조건 병렬 실행하지 않음; 순서를 명시해 직렬화 | Protocol step 4 (겹침 금지 목록) | PASS (아래) |
| E — 독립성이 증명된 6개 subsystem 작업 | 최대 6개 동시 구현 에이전트 | Protocol step 3 (격리 증명 시에만 8까지 상향) | PASS (아래) |
| F — 8개 이상의 반복적·동형 작업 | 네이티브 `workflow` 도구를 우선 검토 | Protocol step 2와 3 | PASS (아래) |

## 라이브 스케줄링 스모크

스케줄링 후속 커밋이 `main` (`abed75c`)에 반영된 뒤 `grok` 0.2.112 headless (`grok -p` / `--single`)로 실행했습니다. 테스트 대상 플러그인은 이 저장소의 `plugins/oh-my-grok-build`를 소스로 한 로컬 설치 `oh-my-grok-build-5cffb366`입니다.

### 시나리오 C — 병렬 read-only 조사

- cwd: 이 저장소 (읽기 전용).
- 프롬프트: 독립 조회 3건 (spawn shape, no-fan-out 불변, `package.json` 테스트 스크립트), 파일 수정 금지.
- 판정: PASS.

| 확인 | 증거 |
|---|---|
| 한 wave, 일괄 런치 | 부모 리포트: `oh-my-grok-build:explorer` 3명을 한 wave에서 동시 실행, 조사를 순차가 아닌 한 parallel batch로 기술 |
| 자격 있는 spawn + isolation | 3명 모두 `subagent_type: oh-my-grok-build:explorer`, isolation `none`, worktree 없음 |
| 조사 결과 정확 | spawn shape는 `ogb-ultrawork/SKILL.md`; no-fan-out은 `executor.md` L13·`explorer.md` L14; `npm test` → `node scripts/validate.mjs` |
| 읽기 전용 경계 | 실행 후 `git status` clean (`main...origin/main`, HEAD `abed75c`) |
| 리포트 계약 | parallel-report 구조 채움 (concurrency, agents 표, verification, remaining risks) |

### 시나리오 A — 독립 3개 패키지 수정

- cwd: throwaway git 저장소. `packages/{alpha,beta,gamma}/index.js`가 각각 잘린 이름(`alph` / `bet` / `gamm`)을 반환.
- 프롬프트: worktree executor 3개를 한 wave로 일괄 실행해 반환값을 `'alpha'` / `'beta'` / `'gamma'`로 수정. 커밋·푸시 금지.
- 판정: PASS.

| 확인 | 증거 |
|---|---|
| 한 wave, 일괄 런치 | 부모 리포트: concurrency 3; `oh-my-grok-build:executor` 3명을 `background: true`로 동시 발사 |
| worktree 격리 | 각 자식이 `isolation: worktree`와 `~/.grok/worktrees/...` 아래 서로 다른 worktree 경로 사용 |
| 소유권 비겹침 | alpha / beta / gamma가 각각 패키지 파일 1개만 소유, 충돌 없음 |
| 통합 | 세 파일 모두 main workspace에 통합, 전체 이름 반환 확인 |
| 커밋/푸시 없음 | 변경은 패키지 파일 3개뿐, 커밋 생성 없음 |

아래 D, E, F 실행은 같은 CLI 버전과 현재 로컬 설치 `oh-my-grok-build-ec452e1b`를 사용했습니다. 실행 전 저장소는 clean이었습니다. 실행이 만든 fixture, smoke 파일, worktree를 모두 제거했으며 커밋·푸시·PR·의존성·저장된 workflow·tracked runtime component는 생성하지 않았습니다.

### 시나리오 D — 동일 database·port integration test

- cwd: 이 저장소, 무시되는 throwaway fixture 사용.
- 프롬프트: 테스트 A를 실행한 다음 B 실행. 둘 다 TCP port `43127`을 bind하고 같은 file-backed test database lock을 획득한 뒤 `shared-database.json`을 갱신.
- 판정: PASS.

| 확인 | 증거 |
|---|---|
| 명시적 직렬화 | 부모 리포트가 병렬 wave 없이 명령 동시성 1 선택: wave 1은 A, wave 2는 A 완료에 의존하는 B |
| 실제 공유 자원 | 두 명령 모두 port `43127`, 같은 exclusive database lock, 같은 database 파일 사용 |
| 두 테스트 성공 | A와 B exit 0: `A: PASS 1785078374289-1785078375091`; `B: PASS 1785078387494-1785078388296` |
| 겹침 없음 | `B.start >= A.end`는 `1785078387494 >= 1785078375091`; 간격 `12403 ms` |
| 정리 | fixture, database, lock, evidence log 제거; port `43127` listener 없음 |

실제로 경합하는 자원으로 스케줄링 판단을 증명했습니다. 테스트 database는 외부 database service가 아니라 로컬 file-backed fixture입니다.

### 시나리오 E — 격리된 subsystem 작업 6개

- cwd: 이 저장소, `.ogb-smoke/subsystems/` 아래 임시 경로 6개 사용.
- 프롬프트: concurrency 6으로 qualified `oh-my-grok-build:executor` 6명을 한 wave에서 시작. 각 child는 `alpha`, `beta`, `gamma`, `delta`, `epsilon`, `zeta` 중 하나만 소유하고 worktree에서 자기 파일만 쓰고 내용을 검증.
- 판정: headless permission-mode 주의사항을 포함한 PASS.

| 확인 | 증거 |
|---|---|
| 한 wave, 일괄 런치 | 부모 리포트가 concurrency 6 선택, 6명 모두 `background: true`로 시작 |
| qualified spawn + isolation | `oh-my-grok-build:executor` 6명이 `capability_mode: all`, `isolation: worktree`, 서로 다른 `~/.grok/worktrees/develop-oh-my-grok-build/...` 경로 6개 사용 |
| 소유권·자원 비겹침 | 명명된 subsystem당 파일 1개; 공유 파일·database·port·cache·configuration·build output·generated artifact·external environment 없음 |
| 통합 | 성공 diff 6개를 검토해 한 번에 하나씩 적용; 거부 결과 없음 |
| 통합 검증 | 파일별 검사, 적용 후 검사 6회, `ALL_SIX_PASS`, `FILE_COUNT_OK=6` 모두 exit 0 |
| 정리 | smoke 파일 6개와 차단된 두 시도 및 성공 실행이 만든 worktree 18개 제거 |

Headless `--permission-mode auto`에서는 제한된 두 번의 시도가 child 6명을 시작했지만 모두 첫 write 전에 `Subagent turn was cancelled: user cancelled a permission prompt`로 취소됐습니다. 최종적으로 명시 승인한 로컬 fixture 재시도는 `--permission-mode bypassPermissions`를 사용했고 prompt·취소 없이 완료됐습니다. 따라서 이 환경에서 시나리오 E는 라이브 증명됐지만, unattended write-capable headless 실행은 `auto`에서 실행할 수 없었습니다.

### 시나리오 F — 반복 작업 8개의 workflow 임계값

- cwd: 이 저장소 (read-only).
- 프롬프트: 선택한 저장소 파일마다 project-relative path와 첫 non-empty 줄을 반환하는 동형 작업 8개. 부모는 먼저 메커니즘을 검토하고 native workflow를 우선하며 direct 8-subagent fallback을 거부.
- 판정: PASS.

| 확인 | 증거 |
|---|---|
| 임계값 판단 | 부모가 유한 목록을 반복적 schema-shaped 작업 8개로 분류하고 direct `spawn_subagent` 8회 대신 native `workflow`와 `parallel()` panel 1개 선택 |
| 필수 작성 gate | inline Rhai workflow를 검증하기 전에 bundled `create-workflow` 스킬 로드 |
| 검증 | 라이브 시작 전 `validate_only` 통과 |
| 예산·터미널 상태 | 명시적 `agent_budget=8`; terminal status `complete`; logical agents `8 / 8`; spent 8, remaining 0; `agent_usage_incomplete=false` |
| 결과 검증 | path/첫 줄 결과 8개가 모두 로컬 `awk 'NF{print; exit}'` 검사와 일치; workflow elapsed-time floor 약 `10497 ms` |
| 콘텐츠형 경계 | inline script만 사용; workflow 파일·tracked edit·의존성·nested workflow·커밋·푸시·PR·네트워크·외부 시스템 없음 |

요청된 남은 스케줄링 시나리오 3개는 모두 로컬에서 실행해 라이브 증명했습니다. 이 집합에서 발견한 유일한 로컬 실행 제한은 시나리오 E의 write-capable headless `auto` permission 경로이며, 명시 승인된 제한적 재시도는 성공했습니다. D, E, F 중 정적 텍스트에서만 추론한 동작은 남지 않았습니다.

## 작성 워크플로 라이브 검증

`grok` 0.2.112로 임시 nested git 저장소 `/Users/yeumgw/develop/oh-my-grok-build/.omx/throwaway/inspect-fixture-live`에서 실행했습니다. 프로젝트 정의는 `.grok/workflows/inspect-fixture.rhai`이며 메타데이터 이름 `inspect-fixture`, `Inspect` 단계 1개, 스키마로 제한한 읽기 전용 에이전트 1개, 필수 `args.target`, 명시적 `agent_budget` 1개로 구성했습니다. 유일한 fixture는 `OGB_LIVE_OK`를 담은 `fixture.txt`였고, 저장소에는 의존성 매니페스트·커밋·푸시·외부 부작용이 없었습니다.

저장된 프로젝트 경로에서는 별도 trust 경계가 드러났습니다. `script_path`로 workflow 도구를 호출한 정확한 결과는 다음과 같습니다.

```text
Tool `workflow` failed: workflow path is not trusted: /Users/yeumgw/develop/oh-my-grok-build/.omx/throwaway/inspect-fixture-live/.grok/workflows/inspect-fixture.rhai (project workflows require folder trust)
```

임시 저장소를 위해 사용자 전역 folder trust를 바꾸지 않도록, 저장 파일의 정확히 같은 본문을 도구의 인라인 `script` 필드로 전달했습니다. 따라서 작성된 워크플로 본문과 라이브 런타임 분기는 검증했지만 saved definition 발견과 `script_path` 로드는 검증하지 못했습니다.

대표 `validate_only: true` 호출은 `args.target = "fixture.txt"`와 `agent_budget = 1`을 사용했습니다. 정확한 결과는 다음과 같습니다.

```text
Smoke check passed for workflow 'inspect-fixture' (1 declared phases; canned-host path paused (Infra): The inspector failed. Check the run details, then start a new run.). This did not launch the workflow and did not exercise every branch or live dependency. Offer a real run next.
```

스모크는 메타데이터와 컴파일을 통과했습니다. canned agent 출력이 필수 `content` 필드를 충족하지 않아 합성 경로는 fail-closed `infra` pause에 도달했습니다. 이어서 명시적으로 승인된 라이브 실행 2개가 다음 터미널 상태를 만들었습니다.

| 경로 | 표시 이름 | 터미널 상태 | 논리 에이전트 | 정확한 증거 |
|---|---|---|---|---|
| 대표 성공 | `inspect-fixture` | `complete` | `1 / 1` | `result_summary = {"content":"OGB_LIVE_OK","target":"fixture.txt"}` |
| `args` 누락 | `inspect-fixture-2` | `blocked` (`verification`) | `0 / 1` | `pause_message = "Pass args.target with the project-relative file to inspect."` |

성공 journal은 `success: true`, `content: "OGB_LIVE_OK"`, `tokens_used: 41344`, `duration_ms: 4419`인 `spawn_agent` 결과 1개를 기록했고, 실행의 `elapsed_ms_floor`는 4446이었습니다. 인자 누락 실행은 `workflow_started`에서 `workflow_paused`로 바로 이동했습니다. 에이전트를 시작하지 않아 journal 파일이 없었고 `elapsed_ms_floor: 4`를 기록했습니다. 실패 메시지가 실행 가능하며 guard가 자식 에이전트 예산을 쓰지 않는 것을 확인했습니다.

## 남은 미검증

- worktree 병합 **충돌** 처리 경로. 위 실행은 파일 소유권이 겹치지 않아 충돌이 발생하지 않았습니다.
- **세션 경계를 넘는** 체인. Grok은 계획을 세션 디렉터리의 `plan.md`에 쓰므로 새 세션은 이를 볼 수 없습니다. 계획 파일이 이미 두 개 있는 디렉터리에서 새 세션으로 `/view-plan`을 실행해 "저장된 계획 없음"을 확인했습니다. `grok -c` 또는 `grok -r <session-id>`로 돌아가면 복원되는 것도 확인했습니다. 스킬은 아직 이 사실을 사용자에게 알려주지 않습니다.
- 임시 저장소에서 저장된 프로젝트 워크플로를 `script_path`로 로드하는 경로. 같은 작성 본문은 `script`로 검증·실행됐지만 도구가 명시적 folder trust를 요구했고, 이번 실행은 사용자 전역 trust 상태를 의도적으로 바꾸지 않았습니다.
- 워크플로 예산 소진과 병렬 슬롯 실패. 라이브 성공과 인자 누락 처리는 실행했지만 이 두 실패 분기는 여전히 미검증입니다.
- 라이브 스케줄링 시나리오 B와 B2. A, C, D, E, F는 위에서 실행했으며 동일 파일 금지와 공유 자원 동시성 하향 매핑만 정적 설계 증거로 남습니다.
- Grok Build의 non-blocking 셸 명령 프리미티브. `ogb-ultrawork` step 4의 장시간 명령 겹침 지침은 capability-neutral로 작성되어 있습니다 — 백그라운드 child가 명령을 소유할 수 있습니다 — 이 저장소가 확인한 것은 subagent spawn 필드로서의 `background: true`뿐이고, 명령 수준의 백그라운드 메커니즘은 확인하지 못했기 때문입니다.

## 실행 명령

```bash
npm test
npm run validate:grok
```

`npm run validate:grok`는 `grok` CLI가 없으면 정적 검증만 통과시키고 런타임 검증을 `SKIP`으로 표시합니다.
