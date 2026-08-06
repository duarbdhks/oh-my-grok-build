# FAQ

[English](faq.md)

## Grok Build 포크인가요?

아닙니다. Grok Build에 설치하는 독립 서드파티 플러그인입니다.

## oh-my-claudecode 같은 별도 실행 엔진인가요?

아닙니다. 콘텐츠 전용 스킬·에이전트입니다. 런타임 오케스트레이션은 Grok Build(서브에이전트, 워크트리, 워크플로, goal, 세션)에 남습니다. [업스트림 평가](upstream-evaluation.ko.md)를 참고하세요.

## Claude API 또는 Anthropic API가 필요하나요?

아니요. OGB는 Anthropic/Claude API를 호출하지 않습니다. 평소처럼 Grok Build를 사용합니다.

## 외부 agent pack이 필수인가요?

아니요. 스킬 7개는 제공 에이전트 6개만 있으면 됩니다. 선택적 서드파티 에이전트 목록은 그 범위 밖 작업을 위한 제안일 뿐 의존성이 아닙니다.

## `/goal`을 대체하나요?

아니요. 품질 고정은 `/ogb-plan`, 장시간 자율 실행은 원하면 네이티브 `/goal`, 독립 증거는 `/ogb-verify`입니다.

## 에이전트를 무제한 병렬 실행하나요?

아니요. 병렬은 상한이 있습니다 (`C*`, 격리 상한, 잔여 child 예산, 워크플로 `agent_budget`). 속도는 소유권 규칙 아래 직렬 대기를 줄이는 데서 오며 무제한 팬아웃이 아닙니다.

## 기존 프로젝트 Git 상태를 보호하나요?

스킬은 명시 요청 없이 commit, push, PR, force-reset, 무관한 변경 폐기를 하지 않도록 지시합니다. Grok 권한 모드는 사용자가 제어합니다.

## 어떤 Grok Build 버전에서 검증됐나요?

역사적 라이브: `0.2.112`. 정적 + plugin validate 영수증: `0.2.118`. [호환성](compatibility.ko.md), [검증](validation.ko.md).

## 계획이 새 세션에서도 유지되나요?

자동으로는 아닙니다. 저장된 계획이 있는 세션을 `grok -c` 또는 `grok -r`로 이어받으세요.

## 프로덕션에서도 자동 승인되나요?

아니요. 계획은 승인 대기로 끝납니다. 고위험 작업은 plan과 verify를 명시적으로 유지하세요. `disable-model-invocation` 스킬은 `/goal` 안에서 조용히 실행되지 않습니다.

## xAI 공식 프로젝트인가요?

아닙니다. xAI와 제휴하거나 승인을 받은 프로젝트가 아닙니다. Grok과 Grok Build는 각 소유자의 상표일 수 있습니다.

## 보안 이슈는 어디에 보고하나요?

[SECURITY.md](../SECURITY.md)를 참고하세요.
