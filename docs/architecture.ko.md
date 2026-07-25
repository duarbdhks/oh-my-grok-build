# 아키텍처

## 목표

`oh-my-grok-build`는 실행 엔진이 아니라 **운영 규율 계층**입니다. Grok Build가 세션과 도구를 소유하고, 이 플러그인은 어떤 순서와 증거 기준으로 사용할지를 정의합니다.

```text
사용자
  └─ OGB 스킬
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

## 상태 전략

v0.1은 별도 데이터베이스나 JSON 상태 파일을 만들지 않습니다.

- 계획은 Grok Build의 현재 saved plan을 사용합니다.
- 실행 진행은 네이티브 todo, subagent, workflow, goal 상태를 사용합니다.
- 장기 기억은 사용자가 Grok Build의 `/remember` 또는 memory 기능을 선택합니다.
- 영구 문서가 필요하면 사용자가 계획을 저장소 문서로 명시적으로 내보냅니다.

이 경계는 세션 복구와 동시 실행의 책임을 하나의 런타임에 유지합니다.

## 병렬 실행 규칙

- 기본 동시 구현 에이전트는 4개입니다.
- 반복형 fan-out은 네이티브 workflow를 사용하며 기본 `agent_budget`은 8개입니다.
- 쓰기 작업은 worktree 격리를 기본으로 합니다.
- 같은 파일을 두 에이전트가 동시에 소유하지 않습니다.
- 파동 사이에는 diff 검토와 좁은 검증을 실행합니다.

## 검증 규칙

```text
수용 기준 정의
  → 직접 테스트·타입체크·빌드
  → 독립 ogb-verifier 재현
  → bundled check-work 최종 검사
  → PASS / FAIL / INCONCLUSIVE
```

`check-work`는 테스트를 대체하지 않으며, 구현자가 보고한 결과를 그대로 신뢰하지 않습니다.

## 보안 경계

v0.1 플러그인은 훅, MCP, LSP, 실행 바이너리, 네트워크 설치기를 포함하지 않습니다. 하지만 스킬과 에이전트는 사용자의 Grok 권한 아래에서 명령과 파일 수정을 요청할 수 있으므로 설치 소스 검토와 정상 permission mode가 필요합니다.
