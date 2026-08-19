# Project guidelines

## 기본 원칙

- 현재 요구사항에 필요한 코드만 추가하고 사용하지 않는 레이어·slice·추상화를 미리 만들지 않기
- 구조의 단일 기준은 `ARCHITECTURE.md`이며 코드와 기준이 달라지면 둘을 함께 수정
- 화면 디자인, 사용자 문구, URL, API 공개 계약은 별도 요구가 없으면 유지

## FSD 구조

- 레이어는 `app → pages → widgets → features → entities → shared` 방향으로만 의존
- `app`: 엔트리포인트, 전역 연결·스타일, 라우터, 인증 가드 등 앱 전체 조립만 배치하고 `viewer-session`처럼 목적이 드러나는 segment 이름 사용
- `pages`: URL 하나를 구성하는 화면, 화면 전용 조회·상태·UI, 여러 하위 레이어의 조합을 배치
- `widgets`: 여러 페이지에서 재사용할 수 있는 독립적인 대형 UI 블록을 배치하고 작은 컴포넌트나 한 화면 전용 UI를 억지로 올리지 않기
- `features`: 입력·검증·요청·상태 변경 경계가 있는 완결된 사용자 행동을 동사 중심 slice로 배치하고, 재사용 횟수와 무관하게 페이지 조립과 독립적으로 유지할 제품 기능일 때 생성
- `entities`: 하나의 비즈니스 개체에 속한 상태·표시 규칙·formatter·정책을 배치하고 같은 레이어의 다른 entity를 직접 import하지 않기
- `shared`: 특정 페이지·행동 실행 맥락이 없는 API 기반 코드와 범용 UI를 배치하고 UI 흐름이나 비즈니스 정책은 넣지 않기
- 현재 사용하는 레이어는 `app`, `pages`, `widgets`, `features`, `entities`, `shared`이며 실제 추출 조건을 만족하지 않는 빈 slice는 만들지 않기

### FSD 배치 판단 순서

1. 앱 초기화·전역 조립이면 `app`에 배치
2. 특정 URL 화면에서만 사용하면 `pages/<route-slice>`에 배치
3. 하나의 비즈니스 개체만 표현하거나 그 개체의 규칙이면 `entities/<entity>`에 배치
4. 여러 entity를 조합하지만 한 화면에서만 사용하면 해당 `page`에 두고, 여러 화면에서 독립적인 큰 블록으로 재사용될 때만 `widgets`로 이동
5. 사용자가 수행하는 완결된 행동이며 페이지의 URL·레이아웃·이동 맥락과 분리 가능하면 `features/<action>`으로 이동
6. 도메인과 무관한 기반 코드나 범용 UI일 때만 `shared`에 배치

- 두 곳에서 사용된다는 사실만으로 공통화하지 않고 책임과 변경 이유가 같을 때만 하위 레이어로 이동
- 코드를 이동하기 전에 목적 레이어에서 필요한 import가 의존 방향이나 같은 레이어 slice 격리를 위반하지 않는지 확인
- slice 내부 segment는 `ui`, `model`, `api`, `lib`만 사용하고 `components`, `hooks`, `stores`, `schemas` 같은 기술명 segment를 만들지 않기
- 모든 page, widget, feature, entity slice와 `shared/api`, `shared/ui`는 루트 `index.ts` public API를 제공
- 다른 slice는 `@/entities/viewer`처럼 public API로만 import하고 내부 경로를 직접 참조하지 않기
- 같은 slice 내부는 상대 경로, 다른 slice는 `@/` 절대 경로를 사용
- 같은 레이어의 다른 slice를 직접 import하지 않으며 공유 책임은 적절한 하위 레이어로 이동
- 빈 폴더나 미래를 위한 slice는 만들지 않기

## 주석과 TypeScript

- 코드 파일 상단에 역할을 한 줄로 설명하되 JSON, 자동 생성 파일, 타입 선언 파일은 제외
- 주요 타입·함수·복잡한 분기에 의도를 설명하고 코드 자체를 반복하는 주석은 생략
- 컴포넌트가 직접 정의한 각 prop 옆에 짧은 인라인 주석 작성; React·HTML 상속 prop은 제외
- `any`는 금지하고 TypeScript `strict` 모드를 유지
- 타입 전용 import는 `import type`을 사용하고 assertion이나 검사 완화로 오류를 우회하지 않기
- 사용하지 않는 코드와 import를 남기지 않기

## React와 폼

- 렌더링 중 API 호출, 상태 변경, 구독 등록을 하지 않고 props와 state를 직접 변경하지 않기
- Hook은 최상위에서만 호출하고 이벤트·구독은 등록한 위치에서 해제
- 상태는 사용하는 가장 가까운 위치에 두고 여러 화면이 공유하는 클라이언트 상태만 entity model의 Zustand로 관리
- Supabase viewer store에는 사용자와 복구 상태만 두고 토큰 저장·갱신은 SDK에 위임
- 검증이 필요하거나 입력이 여러 개인 폼은 `react-hook-form`, Zod, `zodResolver` 사용
- 사용자 행동의 스키마와 제출 상태는 해당 feature의 `model`, 화면 전용 조회 상태는 page의 `model`에 배치하고 제출 타입은 Zod에서 추론
- 사용자용 검증 문구는 Zod 스키마, API 오류 문구는 도메인 오류 변환 함수에서 관리
- 필드 오류는 공통 입력의 오류 prop, API 오류는 폼 `root`, 제출 상태는 `formState.isSubmitting`으로 처리

## Supabase와 환경변수

- React 컴포넌트에서 Supabase를 직접 호출하지 않고 `@/shared/api`의 endpoint wrapper를 사용
- 클라이언트, 생성 DB 타입, 공통 오류 추출기는 `src/shared/api/supabase`에서 관리
- 도메인 endpoint와 오류 변환은 `src/shared/api/endpoints/<domain>`에 배치하되 외부에는 `@/shared/api`로만 공개
- DB 행·입력·수정·enum 타입은 생성 타입의 `Tables`, `TablesInsert`, `TablesUpdate`, `Enums`에서 파생
- 인증 구독은 반환된 subscription을 등록한 위치에서 해제
- 로컬 Supabase 값은 Git에서 제외된 `.env.development.local`, 원격 스테이징 값은 `.env.staging.local`, 변수 목록은 `.env.example`에 관리
- `VITE_` 값은 공개 정보로 간주하고 secret이나 service role key를 클라이언트에 추가하지 않기

## 스타일·레이아웃·접근성

- Tailwind 기본 유틸리티와 `src/app/styles/index.css`의 기존 디자인 토큰을 우선 사용
- 원시 색상값은 `src/app/styles/index.css`의 디자인 토큰 선언과 Pencil 컬러 변수 정의에서만 작성하고, JSX·TS·TSX 및 그 밖의 CSS에서는 반드시 의미 기반 색상 토큰을 참조
- HEX, RGB, HSL, Tailwind 기본 팔레트(`text-red-500` 등), 컴포넌트 내부 `color-mix()`처럼 색상을 직접 만들거나 계산하는 표현을 금지하며 필요한 상태색도 먼저 공통 토큰으로 정의
- `transparent`와 SVG의 `currentColor`는 별도 색상을 정의하지 않는 구조적 표현에 한해 허용
- UI를 구현하거나 Pencil 시안을 수정할 때는 반드시 `기존 컴포넌트 → 디자인 시스템 패턴 → 디자인 토큰 → 신규 생성` 순서로 검토
- 신규 컴포넌트·스타일·색상·간격·타이포그래피를 만들기 전에 기존 컴포넌트, variant, 디자인 시스템 및 토큰에 같은 역할이 있는지 먼저 검색
- 기존 컴포넌트가 있으면 복제하거나 유사 컴포넌트를 새로 만들지 말고 재사용하며, 상태 차이는 가능한 한 기존 variant 또는 prop으로 표현
- 기존 디자인 시스템에 정의된 패턴이 있으면 화면별 임의 스타일보다 해당 패턴의 구조·상태·명명 규칙을 우선 적용
- 색상, 간격, radius, shadow, typography 값은 기존 디자인 토큰을 사용하고 원시 값을 화면이나 컴포넌트에 직접 추가하지 않기
- 필요한 역할이 기존 컴포넌트·디자인 시스템·토큰에 없을 때만 새로 만들고, 일회성 화면 값이 아니라 재사용 가능한 의미 기반 이름과 사용 목적을 함께 정의
- 새 토큰이나 공통 컴포넌트를 추가했다면 디자인 시스템 문서와 Pencil의 컴포넌트·컬러 팔레트에도 같은 변경을 반영해 코드와 시안의 기준을 일치
- 모바일 화면은 `@/widgets/mobile-layout`을 사용하고 페이지에서 `main`을 중복 생성하지 않기
- 부모는 외부 배치, 공통 UI는 내부 구조와 상태를 관리하며 기존 너비·스크롤·safe area 정책을 유지
- 모든 화면의 헤더는 스크롤 영역 밖에 고정하고 스크롤이 필요한 페이지는 `MobileLayout`의 `scrollable`을 명시하며 자식에서 스크롤을 중복 생성하지 않기
- 최상위 탭의 하단 내비게이션은 화면 하단에 띄우고 `scrollable` 콘텐츠는 하단바 뒤까지 확장하되 마지막 목록에 하단바 높이를 고려한 종료 여백 적용
- 클릭 동작에는 `button` 또는 `a`, 입력에는 연결된 label을 사용
- 오류와 상태는 적절한 ARIA 속성으로 연결하고 아이콘 버튼에는 `aria-label`을 제공
- 상태를 색상만으로 전달하지 않기

## 검증과 Git

- 완료 전 `npm run check`를 실행해 Oxlint, Steiger, Prettier, TypeScript, Vite build를 모두 통과
- public API 우회나 import 방향 위반을 예외 처리로 숨기지 않기
- diff와 기존 라우트·API 계약 보존 여부를 확인
- 하나의 커밋에는 하나의 목적만 담고 사용자 변경이나 관련 없는 파일을 포함하지 않기
- 커밋은 Conventional Commits의 `type: subject` 형식을 사용
