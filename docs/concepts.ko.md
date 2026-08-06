# 개념

[English](concepts.md)

## 이 프로젝트가 하는 일

**oh-my-grok-build (OGB)**는 콘텐츠 전용 Grok Build 플러그인입니다. 스킬과 에이전트를 마크다운으로 제공합니다. 데몬을 띄우지 않고, 상태 DB를 열지 않으며, 바이너리를 설치하거나 MCP/LSP를 등록하지 않습니다.

한 줄 포지셔닝:

> Grok Build 네이티브 기능을 대체하지 않고, 합의 계획·제한된 병렬 실행·독립 검증 규율을 더하는 경량 오케스트레이션 툴킷.

## 이 프로젝트가 아닌 것

- Grok Build 포크가 아님
- xAI 공식 제품이 아님
- 자체 SQLite 상태를 가진 Claude 에이전트 데몬 같은 별도 실행 엔진이 아님
- 네이티브 `/goal`, 워크트리, 워크플로, 세션 재개의 대체재가 아님

## 핵심 루프

```text
Interview (선택) → Plan → Execute → Verify
```

| 단계 | 명령 | 애플리케이션 소스 수정 |
|---|---|---|
| 방향 정리 | `/ogb-interview` | 없음 |
| 계획 | `/ogb-plan` | 없음 |
| 계획 검토 | `/view-plan` (네이티브) | 없음 |
| 실행 | `/ogb-start` 또는 `/ogb-ultrawork` | 소유 범위 안에서 있음 |
| 장시간 실행 | `/goal` (네이티브) | 프롬프트에 따름 |
| 검증 | `/ogb-verify` | 없음 (읽기 전용 검증) |
| 재사용 팬아웃 | `/ogb-workflow` | 기본은 워크플로 정의 작성 |
| 진단 | `/ogb-doctor` | 기본 없음 |

## 소유권 모델

실행 스킬은 겹치지 않는 파일·서브시스템 소유권을 요구합니다. 같은 웨이브에서 두 구현자가 같은 파일을 쓰지 않습니다. 쓰기는 기본적으로 네이티브 git 워크트리 격리입니다.

## 병렬 모델

병렬은 “가능한 한 많은 에이전트”가 아니라 상한이 있습니다.

- `/ogb-ultrawork`는 준비된 작업, 격리, 잔여 child 예산으로 max-safe 동시성 `C*`를 계산합니다.
- 기본 격리 상한 4, 소유권·자원 격리가 증명되면 최대 8, 공유 스키마·설정·포트·DB가 있으면 2.
- 반복적인 스키마형 대규모 팬아웃은 무제한 direct spawn 대신 명시적 `agent_budget`(기본 8)의 네이티브 워크플로를 선호합니다.

세부: [아키텍처](architecture.ko.md).

## 검증 모델

완료는 증거 기반입니다.

1. 수용 기준을 먼저 정의
2. 해당되는 직접 테스트·타입체크·빌드
3. 독립 `oh-my-grok-build:verifier` 재현
4. 가능하면 번들 `check-work` 최종 점검
5. 판정: `PASS` / `FAIL` / `INCONCLUSIVE`

구현자가 최종 게이트를 스스로 통과시키지 않습니다.

## 세션·계획 연속성

- 저장된 계획은 Grok Build 계획 기능이 소유합니다.
- 계획을 **새 세션에 자동으로 가져오지 않습니다**.
- 같은 저장된 계획이 필요하면 `/ogb-start` 전에 `grok -c` 또는 `grok -r`로 재개하세요.
- OGB는 네이티브 continue/resume가 실제로 일어났을 때만 연속성을 기록합니다.

## 이름 규칙

| 종류 | 규칙 | 예 |
|---|---|---|
| 스킬 / 슬래시 명령 | bare `ogb-*` | `/ogb-plan` |
| 에이전트 spawn | 플러그인 한정 | `oh-my-grok-build:executor` |

`executor` 같은 bare 이름은 사용자 에이전트로 해석될 수 있습니다. 항상 한정 이름을 쓰세요.

## 관련 문서

- [아키텍처](architecture.ko.md)
- [설계 결정](design-decisions.ko.md)
- [업스트림 평가](upstream-evaluation.ko.md)
