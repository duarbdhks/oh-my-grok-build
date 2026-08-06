# 시작하기

[English](getting-started.md)

플러그인을 설치하고 상태를 확인한 뒤, 몇 분 안에 첫 계획 → 실행 → 검증 루프를 돌립니다.

## 사전 조건

- `grok`로 사용할 수 있는 [Grok Build](https://github.com/xai-org/grok-build) CLI
- 워크트리 격리가 필요한 작업이라면 git 저장소
- 런타임에 Node.js는 **필요 없음** (이 저장소의 정적 검증에만 사용)

이 프로젝트의 과거 라이브 설치·세션은 Grok Build `0.2.112` 기준입니다. 이후 정적 검증과 `grok plugin validate` 영수증은 `0.2.118`을 사용했습니다. [호환성](compatibility.ko.md)과 [검증](validation.ko.md)을 참고하세요.

## 설치

### 마켓플레이스 (권장)

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

### 저장소 하위 경로 직접 설치

```bash
grok plugin install duarbdhks/oh-my-grok-build#plugins/oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

### 등록 확인

```bash
grok plugin details oh-my-grok-build
grok inspect
```

Grok Build 세션에서 `/plugins`로 다시 로드하거나 새 세션을 연 뒤:

```text
/ogb-doctor
```

스킬 7개와 플러그인 한정 에이전트 6개(`oh-my-grok-build:planner` 등)가 보여야 합니다. `~/.claude/agents/` 또는 `~/.grok/agents/`에 같은 짧은 이름이 있으면 경고로 나올 수 있습니다. 한정 이름 등록을 덮어쓰지 않으며 정상 동작입니다.

## 첫 생산 루프

1. **계획** (소스 수정 없음):

   ```text
   /ogb-plan Add a health endpoint that returns 200 and a build id
   ```

2. **네이티브 계획 검토**:

   ```text
   /view-plan
   ```

3. **승인 후 실행**:

   ```text
   /ogb-start Implement the currently approved plan
   ```

4. **독립 검증**:

   ```text
   /ogb-verify Re-check the acceptance criteria for the current changes
   ```

요청이 아직 모호하면 `/ogb-plan` 대신 `/ogb-interview`부터 시작하세요.

## 성공 신호

| 단계 | 건강한 신호 |
|---|---|
| 설치 | `grok plugin details`에서 플러그인이 활성화·신뢰됨 |
| Doctor | 스킬·에이전트 발견, 네이티브 plan/subagent/worktree 점검 보고 |
| Plan | 승인 대기 계획 저장, 계획 단계로 워킹 트리 변경 없음 |
| Start | 작업 소유권, 쓰기 시 워크트리 격리, 요청 없는 commit/push 없음 |
| Verify | 최신 점검과 독립 검증 판정 (`PASS` / `FAIL` / `INCONCLUSIVE`) |

## 이어서 읽기

- [개념](concepts.ko.md) — OGB와 Grok Build의 책임 경계
- [명령 참고](command-reference.ko.md) — 스킬 계약
- [예시](examples.ko.md) — 복사 가능한 시나리오
- [문제 해결](troubleshooting.ko.md) — 설치·런타임 이슈
