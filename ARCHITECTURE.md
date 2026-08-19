# ass_client architecture

이 프로젝트는 Feature-Sliced Design(FSD)의 layer, slice, segment, public API 규칙을 따른다. 구조 판단은 이 문서와 Steiger 검사 결과를 기준으로 한다.

## 의존 방향

```text
app → pages → widgets → features → entities → shared
```

상위 레이어는 하위 레이어만 import할 수 있다. 같은 레이어의 서로 다른 slice는 직접 의존하지 않는다. 공통 책임이 생기면 의미에 맞는 하위 레이어로 이동한다.

`features`는 재사용 횟수보다 사용자의 의도, 입력·검증·요청·상태 변경이 하나의 독립된 제품 행동을 이루는지를 기준으로 추출한다.

## 레이어 책임

| 레이어     | 책임                                          | 현재 예시                                 |
| ---------- | --------------------------------------------- | ----------------------------------------- |
| `app`      | 앱 시작, 전역 연결, 스타일, 라우터, 인증 가드 | `entrypoint`, `viewer-session`, `router`  |
| `pages`    | 라우트 단위 화면과 화면 전용 조회·상태·UI     | `game-list`, `profile-edit`               |
| `widgets`  | 여러 하위 개체를 조합하는 독립적인 큰 UI 블록 | `mobile-layout`                           |
| `features` | 독립적인 입력·요청·상태 변경의 사용자 행동    | `sign-in`, `sign-up`, `update-profile`    |
| `entities` | 비즈니스 개체의 상태·표현·정책                | `viewer`, `game-session`, `participation` |
| `shared`   | 특정 UI 실행 맥락에 종속되지 않은 기반 코드   | `api`, `ui`                               |

## 배치 결정표

1. URL 하나를 구성하고 그 화면에서만 쓰이면 `pages/<route>`에 둔다.
2. 페이지 조립과 분리 가능한 완결된 사용자 행동이면 동사 중심 `features/<action>`으로 추출한다.
3. 비즈니스 개체의 상태, 표시 규칙, formatter이면 `entities/<entity>`에 둔다.
4. 여러 개체를 조합하는 독립적인 화면 블록이면 `widgets/<widget>`에 둔다.
5. 비즈니스 의미가 없는 범용 UI는 `shared/ui`, 특정 화면·행동의 흐름을 모르는 서버 계약과 통신 기반은 `shared/api`에 둔다.
6. 앱 전체 조립과 초기화만 `app`에 둔다.

코드를 두 곳에서 쓴다는 이유만으로 즉시 공통화하지 않는다. 동일한 책임과 변경 이유를 공유할 때만 하위 레이어로 이동한다.

## Slice와 segment

- `pages`, `widgets`, `features`, `entities` 아래의 도메인 폴더가 slice다.
- slice 내부 segment는 `ui`, `model`, `api`, `lib`만 사용한다.
- 기술 이름인 `components`, `hooks`, `stores`, `schemas`를 segment 이름으로 사용하지 않는다.
- 필요하지 않은 segment와 빈 slice는 만들지 않는다.
- `shared`와 `app`은 slice 없이 segment가 바로 위치할 수 있다.

## Public API와 import

- 모든 page, widget, feature, entity slice는 루트 `index.ts`에서 외부 계약을 공개한다.
- `shared/api`, `shared/ui`도 각각 `index.ts`를 공개한다.
- 다른 slice를 사용할 때는 `@/entities/viewer`처럼 public API만 import한다.
- `@/entities/viewer/model/viewer.store` 같은 deep import는 금지한다.
- 같은 slice 내부 import는 상대 경로를 사용한다.
- 다른 slice와 레이어 import는 `@/` 절대 경로를 사용한다.
- public API는 실제 외부 소비자에게 필요한 값만 export한다.

## Feature 추출 기준

아래 조건을 만족하고 독립적으로 유지할 제품 가치가 있을 때 feature slice를 만든다.

- 사용자가 의도를 갖고 수행하는 행동이다.
- 페이지 조립과 독립된 입력, 상태 변화, 제출 또는 요청의 경계를 가진다.
- 입력·검증·요청·상태 변경 중 둘 이상의 책임을 하나의 행동 경계로 묶는다.
- 페이지가 담당할 URL, 레이아웃, 성공 후 이동 같은 실행 맥락과 분리할 수 있다.

재사용은 추출 근거가 될 수 있지만 필수 조건은 아니다. 단순 조회 페이지, 상태 badge, formatter, 레이아웃은 feature가 아니다. 미래 사용을 예상한 빈 feature와 페이지 코드의 기계적인 feature 분할도 금지한다.

## API와 상태

- 기존 Supabase endpoint wrapper와 공개 타입은 `shared/api`에서 유지한다.
- `shared/api`의 endpoint는 서버 도메인 계약을 알 수 있지만 어느 페이지에서 왜 호출하는지, 성공 후 무엇을 하는지는 알지 않는다.
- UI는 Supabase SDK를 직접 호출하지 않고 `@/shared/api`를 통한다.
- 인증 사용자 상태는 `entities/viewer`, 앱 시작 시 Supabase 세션과 연결하는 책임은 `app/viewer-session`이 담당한다. SDK의 토큰 저장·갱신 책임은 변경하지 않는다.
- 세션과 참가 상태의 문구·색상 정책은 각 entity가 담당하고 범용 시각 표현은 `shared/ui`의 `StatusBadge`가 담당한다.

## 자동 검사

- `npm run arch:check`: Steiger로 레이어, public API, import locality 검사
- `npm run check`: Oxlint → Steiger → Prettier → TypeScript/Vite build
- pre-push와 GitHub Actions도 `npm run check`를 실행한다.
- 독립적인 제품 행동은 단일 페이지에서 먼저 사용될 수 있으므로 `features`에 한해 Steiger의 `insignificant-slice` 휴리스틱을 제외한다. 나머지 recommended 규칙은 유지한다.
