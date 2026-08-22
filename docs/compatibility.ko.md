# 호환성

[English](compatibility.md)

## 제품 표면

| 항목 | 값 |
|---|---|
| 플러그인 이름 | `oh-my-grok-build` |
| 플러그인 버전 (매니페스트) | `0.1.0` |
| 스킬 | 8 (`ogb-interview`, `ogb-plan`, `ogb-start`, `ogb-ultrawork`, `ogb-graph`, `ogb-verify`, `ogb-workflow`, `ogb-doctor`) |
| 에이전트 | 6 (`planner`, `architect`, `critic`, `explorer`, `executor`, `verifier`) → `oh-my-grok-build:<name>` |
| 런타임 의존성 | 없음 (콘텐츠 전용) |
| 저장소 검증 Node | `>=20` |

## 증거가 있는 Grok Build 버전

| Grok Build | 검증 내용 | 위치 |
|---|---|---|
| `0.2.112` (stable) | 라이브 설치, 원본 스킬 6개, 이후 interview, 스케줄링 스모크, 작성 워크플로 본문 | [검증](validation.ko.md) 역사 섹션 |
| `0.2.118` (stable) | 정적 `npm test` (215 checks), `grok plugin validate`, 소스 UX 계약 검토 | 검증 “Current Compatibility Receipt — 2026-08-02” |
| 더 새 로컬 CLI | 자동 포함되지 않음 | 재검증 전까지 명령 UX는 미증명으로 취급 |

“모든 Grok Build 버전에서 동작” 주장은 범위 밖입니다. 위 영수증을 우선하세요.

## 사용하는 네이티브 기능

- 플러그인 / 마켓플레이스 설치
- 스킬·에이전트
- Plan mode와 저장 계획 (`/view-plan`)
- 서브에이전트 (`spawn_subagent`)
- git 워크트리 격리
- 워크플로 및 번들 `create-workflow`
- 최종 검증 보조용 번들 `check-work`
- 세션 계속/재개 (`grok -c`, `grok -r`)
- 장시간 실행용 `/goal` (재구현하지 않음)

## 알려진 제한 (요약)

전체: [검증](validation.ko.md) “Still Unverified” 및 현재 후보 `NOT RUN` 행.

- `0.2.112` 이후 릴리스에서 현재 워킹 후보 명령 라이브 UX는 정적 검증이 통과해도 `NOT RUN`일 수 있음
- 저장 프로젝트 워크플로 `script_path` 로딩에 폴더 신뢰가 필요할 수 있음
- 워크트리 **충돌** 처리 경로는 라이브 미증명 (성공 런에 소유 겹침 없음)
- 네이티브 continue/resume 없이 새 세션으로 계획 상태가 이어지지 않음
- 같은 파일 금지 / 공유 자원 동시성 하향 시나리오는 일부가 정적 설계 증거

## 플랫폼

이 저장소에 기술된 라이브 검증은 개발자 macOS + `grok` CLI 환경에서 수행되었습니다. Linux 설치 가능성은 로드맵 기준이며 여기서 재검증된 영수증이 아닙니다.
