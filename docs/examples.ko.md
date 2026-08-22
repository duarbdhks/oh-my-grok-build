# 예시

[English](examples.md)

복사해서 쓰는 프롬프트입니다. 경로와 이름은 저장소에 맞게 바꾸세요. 의도를 보여 주는 예시이며 라이브 세션 전문 기록이 아닙니다.

## 1. 작은 버그 수정

```text
/ogb-plan Fix the null pointer when the profile API receives a missing displayName. Keep the public response shape stable.
```

```text
/view-plan
```

```text
/ogb-start Implement the currently approved plan
```

```text
/ogb-verify Confirm the null-profile case and existing happy path still pass
```

## 2. 구조적 기능

```text
/ogb-plan Add optimistic locking to the user profile update endpoint. Return 409 on version conflict. Include tests and a short rollback note.
```

`/view-plan`으로 검토한 뒤 `/ogb-start`, 이어서 `/ogb-verify`.

## 3. 독립 모듈 병렬 수정

```text
/ogb-ultrawork Fix TypeScript errors in packages/alpha, packages/beta, and packages/gamma. One package per executor, worktree isolation, no shared config edits, verify each package.
```

소유권이 실제로 분리될 때만 사용하세요. 같은 파일을 둘 다 고쳐야 하면 웨이브를 나누거나 `/ogb-start`로 직렬화하세요. 나중 작업이 앞 결과를 읽어야 하면 `/ogb-graph`를 쓰세요.

## 4. 의존이 섞인 그래프

```text
/ogb-graph Audit every HTTP handler under src/api for missing authentication, patch independent handlers, and re-verify the highest-severity findings from source
```

실제 결과 의존과 큰 독립 fan-out이 함께 있을 때 사용하세요. 그 DAG를 `/ogb-ultrawork`로 납작하게 만들지 말고, phase plan 뒤에 별도의 `/ogb-start`를 기다리지 마세요.

## 5. 기존 변경의 독립 재검증

```text
/ogb-verify Re-verify that origin/main...HEAD meets the acceptance criteria in the current plan. Do not modify source. Report PASS, FAIL, or INCONCLUSIVE with fresh command evidence.
```

## 6. 네이티브 `/goal`과 장시간 작업

OGB는 `/goal`을 대체하지 않습니다. 계획을 먼저 고정하고, 장시간은 네이티브로, 검증은 따로 합니다.

```text
/ogb-plan Fix the duplicate-processing bug in the payment webhook. Include idempotency and regression tests.
```

```text
/goal Implement the currently saved plan. Preserve unrelated changes, isolate parallel writes in worktrees, and do not commit, push, or deploy.
```

```text
/ogb-verify Do a final re-verification of the currently saved plan's acceptance criteria
```

스킬에 `disable-model-invocation`이 켜져 있어 `/goal`이 OGB 스킬을 조용히 호출하지 않습니다.

## 7. 요구사항이 모호할 때 interview부터

```text
/ogb-interview We need rate limiting on the public API. I'm unsure about identity keys, limits, and where middleware should live.
```

방향 브리프가 승인되면:

```text
/ogb-plan Build an implementation plan from the approved direction brief for public API rate limiting
```

그다음 `/view-plan` → `/ogb-start` → `/ogb-verify`.

## 8. 재사용 워크플로 작성

```text
/ogb-workflow Author a reusable workflow that reviews each changed TypeScript file in parallel with a bounded agent budget, validates with validate_only, and does not run live unless I ask
```

## 9. 설치 진단

```text
/ogb-doctor
```

컴포넌트가 없으면 재설치·재활성화, `/plugins` 리로드 후 doctor를 다시 실행하세요.
