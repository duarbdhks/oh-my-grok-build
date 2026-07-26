# oh-my-grok-build

[![built for](https://img.shields.io/badge/built%20for-grok--build-black)](https://github.com/xai-org/grok-build)
[![validate](https://github.com/duarbdhks/oh-my-grok-build/actions/workflows/validate.yml/badge.svg)](https://github.com/duarbdhks/oh-my-grok-build/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **[Grok Build](https://github.com/xai-org/grok-build)** — xAI 터미널 코딩 에이전트 — 전용 플러그인입니다.
> 공식 문서: [docs.x.ai/build/overview](https://docs.x.ai/build/overview)

Grok Build 네이티브 계획·병렬 실행·검증 도구 모음입니다. `oh-my-claudecode`의 좋은 작업 규율에서 영감을 받았지만, Claude 런타임을 포크하지 않고 Grok Build의 플러그인·서브에이전트·워크트리·워크플로·목표 모드를 그대로 활용합니다.

[English](README.md) · [설계 평가](docs/upstream-evaluation.ko.md) · [아키텍처](docs/architecture.ko.md) · [로드맵](docs/roadmap.ko.md)

## 결론

`oh-my-claudecode` 전체를 Grok Build용으로 이름만 바꾸는 포크는 권장하지 않습니다. 원본은 Claude Code용 Node.js 런타임, 훅, 상태 관리, CLI 브리지, tmux 작업자까지 포함하고 있으며, Grok Build는 이미 플러그인, 병렬 서브에이전트, 격리 워크트리, 네이티브 워크플로와 `/goal`을 제공합니다.

따라서 이 저장소는 아래 한 가지에 집중합니다.

> Grok Build가 이미 잘하는 실행 기반은 재사용하고, 계획→실행→독립 검증의 품질 규율만 얇게 추가합니다.

## 포함 기능

| 명령 | 역할 | 기본 안전장치 |
|---|---|---|
| `/ogb-interview` | 모호한 아이디어를 한 번에 한 질문씩 방향 브리프로 정리 | 소스 수정 금지, 질문만 수행하며 계획·구현 금지 |
| `/ogb-plan` | Planner → Architect → Critic 합의 계획 | 소스 수정 금지, 최대 3회 검토 루프 |
| `/ogb-start` | 승인된 계획 실행 | 작업 소유권 분리, 쓰기 작업은 워크트리 격리 |
| `/ogb-ultrawork` | 독립 작업을 병렬 실행해 elapsed time 단축 | 기본 동시 작업 4개, 소유권·자원 격리 증명 시 최대 8개, 워크플로 에이전트 예산 8개 |
| `/ogb-verify` | 테스트·타입체크·빌드·독립 검증 | 최신 실행 증거 없이는 완료 판정 금지 |
| `/ogb-workflow` | 재사용 가능한 Grok 워크플로 작성 | `create-workflow` 선행, `validate_only` 필수 |
| `/ogb-doctor` | 플러그인·에이전트·네이티브 기능 진단 | 기본 읽기 전용 |

플러그인은 다음 에이전트를 함께 제공합니다.

- `oh-my-grok-build:planner`: 범위, 작업 그래프, 수용 기준을 설계합니다.
- `oh-my-grok-build:architect`: 구조적 타당성과 트레이드오프를 검토합니다.
- `oh-my-grok-build:critic`: 누락, 모순, 검증 불가능한 항목을 차단합니다.
- `oh-my-grok-build:explorer`: 읽기 전용으로 코드베이스 근거를 수집합니다.
- `oh-my-grok-build:executor`: 범위가 제한된 구현 작업을 수행합니다.
- `oh-my-grok-build:verifier`: 구현자와 독립적으로 최종 결과를 재현합니다.

Grok은 플러그인 에이전트를 플러그인 이름으로 한정해 등록하고 스킬은 bare 이름으로 등록하므로, 이 저장소에서 둘은 서로 반대되는 규칙을 따릅니다. 에이전트에는 `ogb-` 접두사가 없습니다. `oh-my-grok-build:` 한정자가 이미 네임스페이스 역할을 하며, 파일명과 frontmatter의 `name`이 짧은 형태입니다. 스킬은 접두사를 유지합니다. `/ogb-plan`을 구분해 줄 다른 장치가 없기 때문입니다.

에이전트는 항상 한정된 이름으로 생성하십시오. 접두사를 빠뜨려도 요란하게 실패하지 않습니다. bare `planner`나 `executor`는 사용자 환경의 `~/.grok/agents/` 또는 `~/.claude/agents/`에 있는 동명의 다른 에이전트로 해석될 수 있고, 그러면 잘못된 프롬프트로 작업이 진행됩니다. `npm test`는 스킬 안의 한정되지 않은 에이전트 참조를 거부하고, `/ogb-doctor`는 사용자 환경의 동명 에이전트를 경고로 보고합니다.

### 더 넓은 에이전트 모음과 함께 쓰기

이 여섯 개가 스킬 일곱 개에 필요한 전부입니다. `/ogb-interview`부터 `/ogb-doctor`까지 동작하는 데 다른 설치는 필요하지 않습니다. 이 플러그인은 범용 에이전트 라이브러리가 되는 대신 여기서 의도적으로 멈춥니다.

그 범위 밖의 작업 — 코드 리뷰, 보안 감사, 데이터베이스 튜닝, 장애 대응 — 에 특화된 에이전트가 필요하면 [`msitarzewski/agency-agents`](https://github.com/msitarzewski/agency-agents)(MIT) 같은 서드파티 모음이 있습니다. Grok 전용 설치 경로는 없지만, Grok이 Claude 호환 레이어를 통해 `~/.claude/agents/`의 에이전트 정의를 인식하므로 Claude Code 대상 설치가 그대로 동작합니다.

```bash
./scripts/install.sh --tool claude-code
```

제안일 뿐 의존성이 아닙니다. 이 플러그인은 해당 프로젝트에서 무엇도 번들하지 않으며 제휴 관계도 없습니다.

## 설치

### 마켓플레이스 방식

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

### 저장소 하위 디렉터리 직접 설치

```bash
grok plugin install duarbdhks/oh-my-grok-build#plugins/oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
```

설치 상태는 다음 명령으로 확인합니다.

```bash
grok plugin details oh-my-grok-build
grok inspect
```

Grok Build 세션에서는 `/plugins`에서 플러그인을 다시 불러오거나 새 세션을 시작한 뒤 `/ogb-doctor`를 실행합니다.

## 권장 사용 흐름

### 안전한 기능 구현

```text
/ogb-plan 사용자 프로필 API에 낙관적 잠금을 추가하고 충돌 시 409를 반환해줘
```

계획을 `/view-plan`으로 검토한 뒤 실행합니다.

```text
/ogb-start 현재 승인된 계획을 구현해줘
```

### 병렬 작업

```text
/ogb-ultrawork 독립적인 세 모듈의 TypeScript 오류를 수정하고 각각 검증해줘
```

`/ogb-ultrawork`는 Grok Build 자체의 서브에이전트, 백그라운드 실행, `workflow` 도구만으로 스케줄링하며, `oh-my-claudecode`의 `ultrawork` 등 외부 오케스트레이터를 호출하지 않습니다. 속도는 직렬 대기 제거에서 나오며, worktree 격리·소유권·예산·검증은 완화하지 않습니다.

### 검증만 다시 수행

```text
/ogb-verify origin/main...HEAD 변경이 요구사항을 충족하는지 재검증해줘
```

### 장시간 자율 작업

이 프로젝트는 별도 Autopilot 상태 머신을 만들지 않습니다. 먼저 OGB로 계획을 확정하고, Grok Build의 네이티브 `/goal`로 장시간 실행한 뒤 OGB 검증을 별도로 수행합니다.

```text
/ogb-plan 결제 웹훅 중복 처리 버그를 수정해줘
/goal 현재 saved plan을 구현한다. 관련 없는 변경을 보존하고, 병렬 쓰기는 worktree로 격리하며, commit·push·deploy는 하지 않는다.
/ogb-verify 현재 saved plan의 수용 기준을 최종 재검증해줘
```

`disable-model-invocation`이 활성화되어 있으므로 `/goal`이 OGB 스킬을 몰래 호출하지 않습니다. 운영·보안·인증·데이터 마이그레이션·결제·PII 작업은 위처럼 계획과 검증을 명시적으로 분리합니다.

## 설계 원칙

1. **네이티브 우선**: 세션, 목표, 워크트리, 서브에이전트, 워크플로 상태를 중복 구현하지 않습니다.
2. **명시적 비용**: 무제한 병렬화를 금지하고 기본 예산을 작게 둡니다.
3. **계획과 실행 분리**: `/ogb-plan`은 실행하지 않습니다.
4. **증거 기반 완료**: 테스트 로그, 타입체크, 빌드, 재현 결과 중 실제 실행한 것만 보고합니다.
5. **조용한 실패 금지**: 모델·도구·MCP 대체 경로를 몰래 선택하지 않습니다.
6. **사용자 Git 보호**: 명시 요청 없이 커밋, 푸시, PR 생성, 강제 리셋을 하지 않습니다.

## 의도적으로 제외한 것

- Claude Agent SDK 또는 Anthropic API 의존성
- 별도 Node.js 실행 데몬과 SQLite 상태 저장소
- tmux 기반 외부 모델 작업자
- 신규 MCP 서버와 자동 설치 바이너리
- 전역 훅을 이용한 강제 상태 전이
- Grok Build 네이티브 `/goal`, `/workflow`, worktree 기능의 재구현

## 개발 및 검증

런타임 의존성은 없습니다. 저장소 검증에는 Node.js 20 이상만 사용합니다.

```bash
npm test
npm run validate:grok
```

`npm test`는 매니페스트, 마켓플레이스 인덱스, 스킬·에이전트 frontmatter, 구성 요소 일치 여부를 검사합니다. `npm run validate:grok`는 로컬에 `grok` CLI가 있을 때 공식 플러그인 검증 명령도 실행합니다.

## 상태

현재 버전은 `0.1.0`입니다. 정적 검증과 함께, `0.1.0`에 포함된 스킬 6개를 모두 실제 Grok Build 0.2.112 세션에서 실행해 설치·호출·서브에이전트 생성·worktree 통합·독립 검증까지 확인했습니다.

`/ogb-interview`는 그 릴리스 이후에 추가되어, 임시 Express 저장소에서 headless 2회 실행으로 따로 검증했습니다.

`/ogb-interview`부터 `/ogb-verify`까지의 체인도 한 세션 안에서 연속으로 실행했습니다. 스킬 하나씩이 아니라 스킬 사이의 이음새를 확인한 실행입니다.

아직 확인하지 못한 것은 worktree 병합 **충돌** 처리, 작성된 워크플로의 라이브 실행, 그리고 세션 경계를 넘는 체인입니다. 계획은 새 세션으로 넘어가지 않으므로 `/ogb-start` 전에 `grok -c`로 돌아와야 합니다. 전체 증거는 `docs/validation.ko.md`에 있습니다.

## 출처 및 상표

이 프로젝트는 `Yeachan-Heo/oh-my-claudecode`의 계획·병렬 실행·검증 개념에서 영감을 받은 독립 구현입니다. 원본 프로젝트는 MIT 라이선스입니다. 자세한 고지는 `NOTICE.md`를 확인하세요.

이 프로젝트는 xAI 또는 `oh-my-claudecode` 프로젝트와 제휴하거나 보증받지 않았습니다. Grok 및 Grok Build는 각 권리자의 상표일 수 있습니다.

## 라이선스

MIT
