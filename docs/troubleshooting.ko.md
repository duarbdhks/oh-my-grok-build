# 문제 해결

[English](troubleshooting.md)

## 스킬·에이전트가 보이지 않음

1. 설치·활성화 확인:

   ```bash
   grok plugin details oh-my-grok-build
   grok inspect
   ```

2. 세션에서 `/plugins` 리로드 또는 새 세션.
3. `/ogb-doctor` 실행.
4. 소스 경로가 오래됐으면 재설치:

   ```bash
   grok plugin install oh-my-grok-build --trust
   grok plugin enable oh-my-grok-build
   ```

## Doctor가 같은 이름 에이전트 경고

`~/.claude/agents/` 또는 `~/.grok/agents/`에 `planner`, `executor` 등 짧은 이름이 있으면 `WARN`이 납니다. 플러그인 에이전트는 `oh-my-grok-build:<name>`으로 계속 등록됩니다. 잘못된 프롬프트로 가지 않도록 항상 한정 이름을 spawn 하세요.

## 새 세션에서 계획이 없음

저장된 계획은 새 세션에 자동으로 넘어가지 않습니다. 원래 세션을 이어받으세요:

```bash
grok -c
# 또는
grok -r <session-id>
```

`/ogb-start` 전에 `/view-plan`으로 확인하세요.

## 워크트리 격리 불가

워크트리는 git 저장소가 필요합니다. git을 초기화하거나 저장소 루트에서 실행하세요. Doctor가 저장소 준비 상태를 보고합니다.

## 병렬 작업이 계속 충돌

같은 웨이브에서 같은 파일 소유는 금지입니다. 작업을 나누거나 `/ogb-start`로 직렬화하거나 child 파일 범위를 좁히세요. 공유 포트·DB·락 파일도 max-safe 동시성을 낮춥니다.

## 워크플로 `script_path`가 신뢰되지 않음

프로젝트 워크플로 경로에 폴더 신뢰가 필요할 수 있습니다. 과거 검증에서 throwaway fixture 제한으로 기록했습니다. [검증](validation.ko.md)을 참고하세요. 네이티브 `create-workflow` 작성 경로를 우선하고, 신뢰 오류를 OGB 런타임 버그로 보지 마세요.

## `/goal`이 OGB 스킬을 호출하지 않음

정상입니다. 스킬에 `disable-model-invocation: true`가 있습니다. 해당 게이트가 필요하면 `/ogb-plan`, `/ogb-start`, `/ogb-verify`를 명시적으로 호출하세요.

## 검증 문서와 로컬 CLI 버전이 다름

공개 검증 영수증은 특정 Grok Build 버전·날짜에 묶여 있습니다. 더 새 CLI에서 동작할 수 있지만, 재실행 증거가 없으면 해당 버전의 현재 명령 UX는 `NOT RUN`입니다. [호환성](compatibility.ko.md)을 참고하세요.

## 기여 시 정적 검사 실패

저장소 루트에서:

```bash
npm test
```

Node.js `>=20`이 필요합니다. 매니페스트·프론트매터·EN/KO 문서 쌍을 검사하며 라이브 Grok 세션은 아닙니다.
