# 검증 상태

[English](validation.md)

> 아래 `0.1.0` 섹션의 개수는 스킬 6개를 제공하던 그 릴리스의 라이브 실행 기준입니다. `/ogb-interview`는 그 이후에 추가되었고 [별도 섹션](#ogb-interview-라이브-실행-검증)에서 따로 검증합니다.
>
> 이 실행들 이후 에이전트 이름이 바뀌었습니다. `oh-my-grok-build:` 한정자가 이미 네임스페이스 역할을 하므로 `ogb-planner`는 `planner`가 되었고, 나머지 다섯 개도 같습니다. 아래에 기록된 `ogb-*` 에이전트 이름은 당시 실제로 실행된 내용을 서술하므로 그대로 둡니다. 새 이름으로의 등록은 별도로 재확인했으며, 아래 CLI 섹션에 있습니다.

## 현재 호환성 영수증

`2026-08-02` 기준 영수증입니다. 저장소 커밋 `a8c07bd460c95e3a779767f1dc3d1b7291c4a702`을 기준으로 한 `plugins/oh-my-grok-build`의 미커밋 `P0` 후보에 적용되며, 아래 과거 라이브 실행을 현재 결과로 다시 찍지 않습니다.

| 검사 | 상태 | 현재 증거 |
|---|---|---|
| 소스 식별 | PASS | 플러그인 버전 `0.1.0`, 소스 경로 `plugins/oh-my-grok-build`, 위 커밋 기준 미커밋 후보 |
| 저장소 정적 게이트 | PASS | `npm test`가 검사 `215개` 완료 |
| 현재 CLI 식별 | PASS | `grok 0.2.118 (1e1687c1cf6a) [stable]` |
| 직접 플러그인 검증 | PASS | `grok plugin validate plugins/oh-my-grok-build`가 스킬 디렉터리 `1개`, 에이전트 디렉터리 `1개`인 유효한 `0.1.0` 매니페스트 보고 |
| 현재 소스 UX 계약 | PASS | 소스 검토로 `7개` 명령 선택표, 네이티브 `create-workflow` 작성 경로, 분리된 계획·세션·워크플로 수명주기, 잔여 워크트리 책임 필드 확인 |
| 현재 명령 라이브 UX | NOT RUN | 수정한 스킬을 새 `0.2.118` Grok 세션에서 호출하지 않음 |
| 현재 `script_path` 저장 워크플로 로드 | NOT RUN | 이번 후보에서 전역 folder trust를 바꾸거나 해당 경로를 재실행하지 않았으며, 과거 `0.2.112` 시도는 아래에 `LIMITATION`으로 유지 |
| 현재 작성 워크플로 라이브 실행 | NOT RUN | 아래 `0.2.112` 인라인 본문 증거는 과거 기록이며 현재 후보 증거로 승격하지 않음 |

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

## 과거 실제 CLI 검증

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

`/ogb-interview`는 위 `0.1.0` 실행 이후에 추가되어 별도로 검증했습니다. `grok` 0.2.112 headless(`grok -p`)로, 라우트 2개짜리 Express 앱(`src/server.js`가 `GET /status`와 `POST /messages`를 정의, `package.json` 의존성은 `express`뿐, 인증·기존 rate limit 없음)만 있는 임시 git 저장소에서 실행했습니다.

아래 표는 `## Question format` 변경 이후 다시 관찰한 것입니다. 이 변경으로 질문이 매 턴 맨 위로 올라오고 준비도 부기는 맨 끝 `Status:` 블록으로 내려갔습니다. `등록`과 `매니페스트` 행은 최초 실행분을 그대로 둡니다. 이번은 산문 전용 변경이고, 이번 절차에서 `grok inspect --json`을 다시 실행하지 않았으므로 그 증거에 새 날짜를 찍지 않습니다.

`인터뷰 루프` 행은 나머지 네 행과 성격이 다릅니다. 이전 문구는 지금 금지하는 동작(질문보다 병목 쌍을 먼저 진술)을 PASS로 기록한 것이므로, 이 행은 재확인이 아니라 판정 기준이 뒤집힌 것입니다.

| 검사 | 판정 | 증거 |
|---|---|---|
| 등록 | PASS | `grok inspect --json`에 `ogb-interview`가 플러그인 소스로 `userInvocable: true` 등록 |
| 매니페스트 | PASS | `grok plugin validate plugins/oh-my-grok-build`가 추가된 스킬 디렉터리를 포함해 유효 판정 |
| 스코프 형태 게이트 | PASS | Round 0에서 저장소를 먼저 읽고 `src/server.js`·`package.json`을 `Evidence:` 줄에 인용, 제시한 컴포넌트 4개를 그대로 `Status:`에 라벨로 옮김, 확인 질문 1개만 제시 |
| 질문보다 증거 우선 | PASS | 미들웨어·인증·rate-limit 의존성 부재를 먼저 확인한 뒤 질문, 코드가 답하는 내용을 사용자에게 되묻지 않음 |
| 인터뷰 루프 | PASS (기준 반전) | 재개 실행의 턴이 질문("Should the limit count requests per client IP, or is there some other key you want to count against?")으로 시작하고 부기는 전부 맨 끝 `Status:` 블록으로 밀려남. 기계적 측정: `Status:`의 바이트 오프셋 999, 그 앞 구간에 `CLEAR`/`PARTIAL`/`UNKNOWN`/`dimension`/`bottleneck`/`component`/`readiness` 0건. `Status:` 블록은 명세대로 컴포넌트를 인지함 — 보류 컴포넌트는 사유와 함께 한 번만 언급, 끝난 컴포넌트는 `Cleared: Routes covered.`로 이름만(등급 반복 없음), 남은 컴포넌트는 `Limit policy: Goal — PARTIAL, counting key (per-IP vs other) not chosen.` |
| 추천 답 제시 | PASS | 모든 질문에 근거 붙은 추천 답, 라벨이 아니라 결과를 서술하는 번호 대안, 자유 입력 옵션 동반 |
| 언어 | PASS | 한국어 프롬프트에서 질문·왜 중요한지·`Recommended:` 사유·대안이 한국어로 나오고, `Recommended:`/`Evidence:`/`Status:`와 컴포넌트 라벨(`Routes covered`, `Limit policy` 등)·등급은 영어로 유지됨. 전역 한국어 지시를 제거한 대조 실행에서는 영어 프롬프트가 영어 턴을 만들어, 규칙의 효과와 환경의 효과가 분리됨 — 아래 주석 참고 |
| 읽기 전용 경계 | PASS | 네 번의 실행 후 fixture에서 `git status --short --branch` 깨끗, untracked 파일도 없음. plan 생성·커밋·의존성 설치 없음 |

실행은 네 번입니다. 영어 콜드 스타트, 확정된 컴포넌트와 Round 0 답변을 인자로 다시 붙여 넣은 재개 실행(상태 파일 없이 재개하는 문서화된 방식이며, step 3 인터뷰 루프에 도달하는 유일한 실행), 한국어 콜드 스타트, 그리고 대조 실행입니다. 대조 실행이 필요했던 이유는 이 머신의 `~/.claude/CLAUDE.md`가 한국어 출력을 지시하고 Grok이 Claude 호환 레이어로 그 파일을 읽기 때문입니다 — 그래서 첫 영어 프롬프트 실행도 한국어로 답했습니다. `HOME`을 그 파일이 없는 디렉터리로 바꿔 다시 실행하니 영어 턴이 나왔고, 이것이 스킬의 언어 규칙과 환경 지시를 구분해 줍니다.

이 증거의 한계 두 가지를 남깁니다. step 4 챌린지 패스(라운드 4·6·8)와 step 5 round-10 체크포인트는 네 번의 실행으로는 도달하지 못하므로, 두 턴이 `## Question format`을 지키는지는 정적 텍스트 감사로만 확인되었고 라이브 증거가 없습니다. 그리고 매 실행에서 규칙이 적용되는 턴 앞에 짧은 도입 문장이 하나씩 붙었습니다. `## Question format`이 지배하는 대상은 턴이지 그 도입 문장이 아니므로 위반으로 보지 않았습니다.

## 한 세션 안에서의 전체 체인 실행

위의 검증은 모두 스킬 하나씩을 각각 별도 headless 실행으로 확인한 것입니다. 이번에는 `/ogb-interview`부터 `/ogb-verify`까지를 하나의 대화형 Grok Build 세션 안에서 연속으로 실행했고, 모든 스킬이 문서대로 동작했습니다.

개별 실행이 덮지 못하던 것은 **이음새**입니다. 인터뷰가 만든 브리프가 `/ogb-plan`으로 넘어가고, 승인된 계획이 다시 설명하지 않아도 `/ogb-start`에 전달되며, `/ogb-verify`가 같은 수용 기준으로 마무리되는 부분입니다.

또한 이 실행은 한 세션 안에 머물렀습니다. 이것이 지원되는 경로입니다. 계획은 새 세션으로 넘어가지 않으며, 아래 미검증 항목을 참고하세요.

## `/ogb-ultrawork` 스케줄링 시나리오 매핑

각 행을 `ogb-ultrawork` `SKILL.md`에서 그것을 지배하는 규칙과 대조합니다. 위의 이름 규칙이 정확한 메커니즘을 인용하는 것과 같은 방식입니다. 시나리오 A, C, D, E, F는 다음 절에 과거 라이브 headless 증거가 있습니다. B와 B2만 설계 매핑으로 남습니다. 아래 기대 `C*` / mechanism 주석은 max-safe 공식과 ROLE_LENS 프로토콜의 정적 설계 목표이며, 새 라이브 PASS를 주장하지 않습니다.

| 시나리오 | 기대 동작 | 지배 규칙 | 라이브 |
|---|---|---|---|
| A — 독립 3개 패키지 수정 | 같은 Wave; `C*=3` (iso_cap 기본 4 또는 증명 시 8); spawn 3 | Protocol step 2, 4, 6 | PASS (아래; 과거 증거) |
| B — 동일 schema/config 파일을 둘 다 쓰는 작업 | 같은 Wave에 두지 않음 (동일 파일 소유 금지) | Protocol step 5 (never same file) | 정적만 |
| B2 — schema/자원을 공유하되 쓰는 파일은 서로 다른 작업 | `iso_cap=2`, `C*≤2` 인 경우에만 같은 Wave 허용 | Protocol step 4–5 | 정적만 |
| C — 독립적인 파일 검색과 설정 읽기 | 하나의 병렬 read-only 배치; explorer + ROLE_LENS | Protocol step 1 | PASS (아래; 과거 증거) |
| D — 동일 database와 port를 공유하는 integration test | 무조건 병렬 실행하지 않음; 경합 명령은 직렬화 (에이전트 `C*` 와 별개) | Protocol step 5 (겹침 금지 목록) | PASS (아래; 과거 증거) |
| E — 독립성이 증명된 6개 subsystem 작업 | `iso_cap=8`, `C*=6`, 동시 구현 에이전트 6 | Protocol step 2, 4, 6 | PASS (아래; 과거 증거) |
| F — 8개 이상의 반복적·동형 작업 | 네이티브 `workflow` 우선; 격리가 높아도 직접 executor 8 금지 (step 2 HARD RULE) | Protocol step 2 (mechanism non-inversion) | PASS (아래; 과거 증거) |

### Max-safe 공식 worked examples (정적)

| 시나리오 | N_ready | iso_cap | remaining | C* | chosen C | mechanism |
|---|---:|---:|---:|---:|---:|---|
| A | 3 | 4 (또는 증명 시 8) | 16 | 3 | 3 | spawn_subagent |
| B2 | 2+ | 2 | 16 | 2 | ≤2 | spawn_subagent |
| D | n/a (명령 직렬) | n/a | — | 경합 명령 병렬 wave 없음 | serialize | spawn/serial |
| E | 6 | 8 | 16 | 6 | 6 | spawn_subagent |
| F | — | — | — | 직접 spawn 8 해당 없음 | workflow | workflow `agent_budget=8` |

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
- **세션 경계를 넘는** 체인의 새 라이브 실행. 과거 검사에서는 새 세션이 이전 세션의 `plan.md`를 보지 못하고 `grok -c` 또는 `grok -r <session-id>`가 이를 복원함을 확인했습니다. 현재 소스는 이 경계를 설명하고 연속성을 별도로 보고하지만, 수정한 경로를 `0.2.118`에서 다시 실행하지는 않았습니다.
- 임시 저장소에서 저장된 프로젝트 워크플로를 `script_path`로 로드하는 경로. 같은 작성 본문은 `script`로 검증·실행됐지만 도구가 명시적 folder trust를 요구했고, 이번 실행은 사용자 전역 trust 상태를 의도적으로 바꾸지 않았습니다.
- 워크플로 예산 소진과 병렬 슬롯 실패. 라이브 성공과 인자 누락 처리는 실행했지만 이 두 실패 분기는 여전히 미검증입니다.
- 라이브 스케줄링 시나리오 B와 B2. A, C, D, E, F는 위에서 실행했으며 동일 파일 금지와 공유 자원 동시성 하향 매핑만 정적 설계 증거로 남습니다.
- Grok Build의 non-blocking 셸 명령 프리미티브. `ogb-ultrawork` step 5의 장시간 명령 겹침 지침은 capability-neutral로 작성되어 있습니다 — 백그라운드 child가 명령을 소유할 수 있습니다 — 이 저장소가 확인한 것은 subagent spawn 필드로서의 `background: true`뿐이고, 명령 수준의 백그라운드 메커니즘은 확인하지 못했기 때문입니다.

## 실행 명령

```bash
npm test
npm run validate:grok
```

`npm run validate:grok`는 `grok` CLI가 없으면 정적 검증만 통과시키고 런타임 검증을 `SKIP`으로 표시합니다.
