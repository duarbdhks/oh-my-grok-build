# 아키텍처

[English](architecture.md)

## 목표

`oh-my-grok-build`는 실행 엔진이 아니라 **운영 규율 계층**입니다. Grok Build가 세션과 도구를 소유하고, 이 플러그인은 어떤 순서와 증거 기준으로 사용할지를 정의합니다.

```text
사용자
  └─ OGB 스킬
      ├─ 정리: 한 번에 한 질문 → 방향 브리프
      ├─ 계획: planner → architect → critic
      ├─ 실행: explorer / executor + native worktree
      ├─ 병렬: native subagents 또는 native workflow
      └─ 검증: direct checks → verifier → check-work

Grok Build 네이티브 계층
  ├─ session / plan / goal
  ├─ subagents / capability modes
  ├─ git worktrees
  ├─ Rhai workflows
  ├─ skills / agents / plugins
  └─ MCP inheritance / permissions
```

## 책임 경계

| 관심사 | 소유자 |
|---|---|
| 세션 저장·재개 | Grok Build |
| 자율 목표 상태 | Grok Build `/goal` |
| 서브에이전트 생명주기 | Grok Build |
| worktree 생성·적용·정리 | Grok Build |
| 워크플로 실행·예산·일시정지 | Grok Build |
| 플러그인 신뢰와 MCP 상속 | Grok Build |
| 계획 품질 게이트 | oh-my-grok-build |
| 실행 파동과 작업 소유권 규칙 | oh-my-grok-build |
| 완료 증거와 독립 검증 순서 | oh-my-grok-build |

## 수명주기 경계

OGB는 계획 재사용을 세션이나 워크플로 재개로 잘못 해석하지 않도록 관련된 `4개` 수명주기를 분리합니다.

| 수명주기 | 소유자 | OGB 기록 |
|---|---|---|
| 저장된 계획 | Grok Build 계획 기능 | `current-saved-plan`, `explicit-plan-path`, `concrete-task` |
| 세션 계속·재개 | Grok Build `grok -c` / `grok -r` | `same-session`, `grok-continue`, `grok-resume`, `not-applicable` |
| 저장된 워크플로 정의와 실행 | Grok Build 워크플로 런타임 | 정의 경로, 검증 상태, 실행 상태, 네이티브 재개 경로를 각각 기록 |
| 워크트리 통합·정리 | 실행 사용자나 에이전트가 지시하는 Grok Build 워크트리 | 통합한 워크트리, 남은 워크트리, 정리 담당자, 수동 다음 조치 |

현재 저장된 계획을 실행할 때만 세션 연속성 메타데이터를 기록할 수 있습니다. 명시적 계획 파일이나 구체적 작업에는 `not-applicable`을 사용하며, 입력이 비슷하다는 이유로 네이티브 재개를 주장하지 않습니다.

## 상태 전략

v0.1은 별도 데이터베이스나 JSON 상태 파일을 만들지 않습니다.

- 계획은 Grok Build의 현재 saved plan을 사용합니다.
- 실행 진행은 네이티브 todo, subagent, workflow, goal 상태를 사용합니다.
- 장기 기억은 사용자가 Grok Build의 `/remember` 또는 memory 기능을 선택합니다.
- 영구 문서가 필요하면 사용자가 계획을 저장소 문서로 명시적으로 내보냅니다.

이 경계는 세션 복구와 동시 실행의 책임을 하나의 런타임에 유지합니다.

## 병렬 실행 규칙

- 동시 구현 에이전트는 max-safe 상한 `C* = min(N_ready, iso_cap, remaining_child_calls, 8)` 를 사용합니다. `iso_cap` 은 소유권이 분리되면 기본 4, 모든 동시 멤버에 대해 파일·subsystem 소유권과 실행 자원 격리가 증명되면 8, schema·설정·generated file·dependency lock·build output·cache·port·database·외부 환경을 공유하면 2입니다. 격리가 허용되면 `C = C*` 로 채우는 것이 기본이며, 그보다 적게 띄우면 명시적 이유가 필요합니다.
- `/ogb-ultrawork` 는 점수보다 메커니즘을 먼저 고릅니다. 4개 초과의 반복·스키마형 작업은 격리가 높아도 네이티브 workflow를 우선합니다. 이질적인 5–8개 작업은 `C*` 아래에서 `spawn_subagent` 를 쓸 수 있습니다.
- spawn 경로 child 프롬프트에는 닫힌 `ROLE_LENS` (`general | backend | frontend | data | sre | security | docs | test`) 가 들어갑니다. 기본 spawn 타입은 `oh-my-grok-build:executor` 와 `oh-my-grok-build:explorer` 만입니다.
- 승인 없이 사용 가능한 수명 child-agent 잔여는 `16 − (prior_spawn_children + prior_workflow_logical_agents)` 입니다. workflow `agent_budget`(기본 8)은 workflow당 캡이며 두 번째 무제한 풀이 아닙니다.
- 반복형 fan-out은 네이티브 workflow를 사용하며 기본 `agent_budget`은 8개입니다.
- 쓰기 작업은 worktree 격리를 기본으로 합니다.
- 같은 파일을 두 에이전트가 동시에 소유하지 않습니다.
- 기본(베이스라인 / `/ogb-start` 스타일): 파동 사이에 diff 검토와 좁은 검증을 실행합니다. `/ogb-start` 는 더 단순한 상한을 유지하며, 형식화된 `C*` 와 ROLE_LENS 는 ultrawork 프로토콜입니다.
- `/ogb-ultrawork`는 파동 안에서 점진적으로 진행합니다. 각 child가 끝나는 즉시 그 diff를 검토하고(읽기 전용; 끝난 child 검토를 위해 파동 전체 비교를 기다리지 않음), 소유권이 이미 서로 겹치지 않음이 증명된 미시작 작업으로 빈 슬롯을 채우며(채우기 전 `C*` 재계산), worktree 결과를 한 번에 하나씩 통합한 뒤 적용마다 좁은 검증을 다시 실행합니다.

## 검증 규칙

```text
수용 기준 정의
  → 직접 테스트·타입체크·빌드
  → 독립 verifier 재현
  → bundled check-work 최종 검사
  → PASS / FAIL / INCONCLUSIVE
```

`check-work`는 테스트를 대체하지 않으며, 구현자가 보고한 결과를 그대로 신뢰하지 않습니다.

## 보안 경계

v0.1 플러그인은 훅, MCP, LSP, 실행 바이너리, 네트워크 설치기를 포함하지 않습니다. 하지만 스킬과 에이전트는 사용자의 Grok 권한 아래에서 명령과 파일 수정을 요청할 수 있으므로 설치 소스 검토와 정상 permission mode가 필요합니다.
