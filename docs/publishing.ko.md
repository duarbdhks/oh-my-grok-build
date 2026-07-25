# GitHub 게시 절차

[English](publishing.md)

저장소 루트에서 다음 명령을 실행합니다.

```bash
npm test
git status --short --branch
gh auth status
gh repo create duarbdhks/oh-my-grok-build --public --source=. --remote=origin --push
```

이미 원격 저장소가 만들어졌다면:

```bash
git remote add origin git@github.com:duarbdhks/oh-my-grok-build.git
git push -u origin main
```

게시 후 검증합니다.

```bash
grok plugin marketplace add duarbdhks/oh-my-grok-build
grok plugin install oh-my-grok-build --trust
grok plugin enable oh-my-grok-build
grok plugin details oh-my-grok-build
grok inspect
```

저장소 토픽은 Grok Build 플러그인임을 드러내도록 설정합니다.

```bash
gh repo edit duarbdhks/oh-my-grok-build \
  --add-topic grok-build --add-topic grok --add-topic xai \
  --add-topic xai-org --add-topic grok-plugin --add-topic ai-agents \
  --add-topic developer-tools
```

첫 태그는 실제 Grok 세션 검증이 끝난 뒤 생성합니다. `grok plugin tag`가 `plugin.json`의 버전으로 태그를 만들어 줍니다.

```bash
git tag -a v0.1.0 -m "oh-my-grok-build v0.1.0"
git push origin v0.1.0
```

## 공식 마켓플레이스

xAI는 [`xai-org/plugin-marketplace`](https://github.com/xai-org/plugin-marketplace)를 공식 마켓플레이스로 운영하며, `grok`은 이를 `xai-official` 소스로 기본 등록합니다. 등재된 플러그인은 `.grok-plugin/marketplace.json`에 커밋 SHA로 고정되므로, 등재를 요청하려면 먼저 이 저장소가 태그된 안정 버전을 가져야 합니다.

`docs/roadmap.ko.md`의 v0.1 검증 게이트를 통과하고 `v0.1.0` 태그를 만든 뒤 [PR #146](https://github.com/xai-org/plugin-marketplace/pull/146)으로 등재를 신청했습니다. 리뷰 대기 중이며, 머지 전까지 `oh-my-grok-build`는 서드파티 마켓플레이스로 남습니다.

등재 후 플러그인을 갱신하려면 새 커밋을 푸시하는 것만으로는 부족합니다. 마켓플레이스 엔트리가 SHA로 고정되어 있으므로 별도 PR로 SHA를 올려야 사용자에게 반영됩니다.
