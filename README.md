# UNO — Comeback Project

UNO Entertainment 홈페이지와 독립 실행 가능한 Comeback Archive를 함께 제공합니다. 가상의 앨범 AFTERIMAGE 및 홈페이지의 라이브 일정·문구는 임시 콘텐츠입니다.

## UNO Entertainment 홈페이지

로컬 실행 후 `http://localhost:3000/homepage/`에 접속합니다. 홈페이지 진입 파일은 `dist/homepage/index.html`이며, 기존 독립 Archive는 `http://localhost:3000/`에서 계속 실행됩니다.

- `dist/homepage/homepage.js`: Header → Live Now → Archive → Process → Upcoming Live → Brand → Footer 구성 및 홈페이지 인터랙션
- `dist/homepage/homepage.css`: `.uno-homepage` 범위의 스타일과 반응형 배치
- `dist/homepage/homepageData.js`: Hero, 제작 과정 카드, 필터, 라이브 일정, 소셜 링크, Footer 콘텐츠
- `dist/homepage/assets/`: 교체 가능한 홈페이지 전용 이미지 및 기존 로고의 복사본

홈페이지는 기존 `ComebackProject` 클래스를 직접 import하고 하나의 section에 초기화합니다. 독립 실행용 `dist/index.html`은 유지합니다. 최신 수정에서는 공유 컴포넌트의 LISTEN 지름 비율만 `listenLayoutData.diameterRatios`로 분리했으며 기존 morph·선택·rotation 구조는 유지합니다. Desktop wrapper도 928px을 확보하며, guide는 wrapper의 clip-path로 Archive 안에서만 표시합니다. 홈페이지 안의 desktop 오디오 utility만 section 내부에 배치해 잘림을 방지합니다. 기존 IntersectionObserver가 화면 밖의 회전을 일시정지합니다. 홈페이지 종료 시 `unoHomepage.destroy()`는 원래 컴포넌트도 정리합니다.

이미지 교체는 `homepageData.js`의 각 `image` 값을 수정하거나 해당 홈페이지 asset 파일만 교체하면 됩니다. Hero는 Figma 원본의 `assets/figma/hero-live-3543-150.png`를 사용하며 로고와 아이콘도 같은 폴더에 보관합니다. Process의 8개 이미지와 다음 라이브의 `upcoming-live.png`, 기존 Archive 이미지는 보존했습니다. `artistProcessData`에서 image/title/artist/category/description을 바꾸면 카드와 상세 안내에 함께 반영됩니다. Pretendard는 `assets/fonts/`에서 로컬 제공하며 라이선스는 같은 폴더의 `OFL.txt`에 있습니다.

로그인·실시간 방송·알림 신청은 준비 중 안내를 표시하는 프런트엔드 프로토타입입니다. 라이브 일정은 임시 데이터이며, 캘린더 저장은 데이터의 날짜/시간과 10분 전 알림을 담은 ICS 파일을 다운로드합니다. 실제 알림 서버·회원 시스템은 연결하지 않았습니다. 소셜 URL과 법적 문구도 임시 값이며 `homepageData.js`에서 교체합니다.

최종 디자인 기준은 [Figma 1440px 와이어프레임](https://www.figma.com/design/VV0hSYzQLOqMcvb3LOdyz8/3%ED%8C%80?node-id=3496-76)입니다. 1440px에서 Header/Hero/Archive/Process/Upcoming/About/Footer 높이는 각각 62/790/928/약 863/1024/550/150px입니다. PROCESS는 고정 높이가 아닌 min-height 840px과 콘텐츠 흐름을 사용하며, 기본 전체 높이는 약 4367px입니다. 이후 사용자가 공통 desktop gutter 105px / 가용 폭 1230px을 명시적으로 선택했으므로 기존 Figma의 섹션별 120px gutter와 Footer의 별도 좌표를 공통 grid로 통일했습니다. `--page-gutter`는 24–105px 사이에서 viewport에 따라 변하며 고정 content max-width는 사용하지 않습니다. Hero 배경과 PROCESS rail은 full-bleed를 유지합니다. Archive 내부 stage/원/정보/Behind geometry는 바꾸지 않고 섹션 label만 공통 grid에 정렬합니다.

Brand는 부모 grid의 오른쪽 column에 기존 680×310px 심볼을 배치해 X=655–1335px을 사용하고, 왼쪽 그룹과 Footer는 X=105px부터 시작합니다. Upcoming은 X=105–1335px, 두 column gap은 최신 Figma에서 측정한 60px입니다. PROCESS는 1200px 이상에서 공통 content grid와 분리된 wide rail을 사용합니다. 1440px에서는 rail 1376px, 자체 좌우 gutter 32px, gap 26px이며 중앙 확대를 포함한 완전한 카드 5개에 맞춰 폭을 계산합니다. 이미지 비율과 카드 최소 높이를 유지하고 넓은 화면이나 긴 콘텐츠에서는 높이가 자연스럽게 늘어납니다. 제목·필터·화살표·rail·progress는 문서 흐름에 연결되며 100vh나 고정 section height를 사용하지 않습니다. 전체 8개 데이터·순서·이미지와 controller는 변경하지 않았습니다. 작은 화면의 기존 rail 배치는 유지합니다. 기존 dark Archive와 실제 카드·라이브 콘텐츠는 보존합니다. LISTEN 지름은 안쪽부터 95.2/156.4/204/272/326.4/401.2/455.6/537.2/598.4/680px입니다.

검증: Chromium에서 전체 페이지와 각 section 스크린샷을 비교했고, 1440/1280/1024/768/390/360px overflow, 로컬 asset과 font, 필터별 무한 루프/진행 바, 중앙 확대, 앵커/모달/TOP/캘린더, Archive Focus/양방향 morph/10개 chapter/동일 DOM과 회전, utility 잘림과 상태 유지, 독립 실행 버전을 확인했습니다.

## 로컬 실행

```sh
npm run dev
# http://localhost:3000
npm run check
```

설치할 런타임 의존성은 없습니다. ES modules, Web Animations API, ResizeObserver를 지원하는 최신 브라우저에서 실행됩니다.

## 콘텐츠 교체

`dist/comeback-project/comebackData.js`만 수정합니다.

- `albumData`: 섹션 라벨, 앨범명, 아티스트, 연도, 소개
- `trackData`: 트랙명, cover, audio, Spotify / YouTube Music URL, 재생 시간, 회전 설정
- `behindData`: 단계명, 제목, 설명, 썸네일, video, CTA 라벨과 링크
- `releaseData`: TODAY, 발매 문구, 발매 CTA
- `motionData`: 이동 시간, stagger, 노드 크기

`cover`와 `thumbnail`은 이미지 URL이며 기존 파일만 교체해도 됩니다. 음원은 `audio`에 URL을 설정하면 작동합니다. 한 번에 한 트랙만 재생되고 60초 이후 정지합니다. 빈 URL은 이동하지 않으며 준비 중 안내가 표시됩니다. 비하인드 `video`를 연결하면 모달에서 네이티브 비디오 플레이어를 사용합니다. 비하인드 하단 CTA는 표시하지 않으며 썸네일의 재생 버튼으로 콘텐츠를 엽니다.

## 기존 홈페이지에 삽입

`dist/comeback-project/` 디렉터리를 기존 프로젝트에 복사하고 원하는 위치에 다음 코드를 삽입합니다. `index.html`은 프로토타입 실행용이므로 복사할 필요가 없습니다.

```html
<link rel="stylesheet" href="/comeback-project/comeback-project.css">
<section id="uno-comeback-project" class="comeback-project" aria-label="UNO Comeback Project"></section>
<script type="module">
  import { ComebackProject } from '/comeback-project/ComebackProject.js';
  const component = new ComebackProject(document.querySelector('#uno-comeback-project'));
  // SPA에서 섹션을 제거하기 전에 component.destroy()를 호출하세요.
</script>
```

이미지 상대 경로는 `import.meta.url`을 기준으로 계산합니다. 외부 이미지 사용 시 URL만 교체하세요. CSS는 `.comeback-project`로 범위를 제한하며, body 스타일은 독립 실행용 index.html에만 있습니다. 홈페이지의 전역 overflow / position / scroll 설정에 의존하지 않습니다.

## 인터랙션 구조

10개의 원형 버튼은 초기화 시 한 번 생성됩니다. LISTEN과 BEHIND는 같은 섹션에서 같은 버튼을 유지합니다. 현재 transform을 기록하고 최종 transform을 설정한 후, Web Animations API의 FLIP 방식으로 이전 상태에서 최종 상태까지 이동합니다. 버튼은 위치와 morph, 안쪽 surface는 hover scale / opacity, 이미지는 독립 회전을 담당하므로 artwork 교체가 위치·크기·애니메이션에 영향을 주지 않습니다.

기본 전환은 회전 감속 150ms + 이동 1120ms + stagger 35ms × 9로 약 1.59초입니다. 타임라인 노드 위치는 텍스트 길이와 무관하게 계산됩니다. 전환 중 mode 버튼을 잠그고 중복 요청을 무시합니다. 화면 밖과 탭 비활성 상태에서는 회전을 멈추며 reduced motion에서는 정지된 이미지와 짧은 전환을 제공합니다. destroy()는 관찰자, 이벤트, 애니메이션, 타이머, 오디오를 정리합니다.

## 검증

1440×1024 데스크톱 및 1024/768/390px에서 실제 Chromium으로 확인했습니다. 10개 DOM identity 유지, 양방향 이동, 연속 클릭 잠금, 타임라인 노드 크기와 간격, 긴 문구, 트랙·단계 선택, 모달, 임시 음원 안내, reduced motion, cleanup을 확인합니다.

## 임시 아트워크

`assets/tracks/track-01.svg`부터 `track-10.svg`까지 독립적인 원본 SVG입니다. 하나의 이미지나 GIF가 아닌 10개의 교체 가능한 이미지이며, 실제 아티스트 또는 기존 앨범 커버를 복제하지 않았습니다.

## LISTEN radial interaction

각 artwork는 42–70초 주기로 독립 회전합니다. Hover로 회전을 멈추지 않습니다. 포인터와 공통 중심 사이의 거리를 기준으로 10개의 원래 반경을 판정하여 TRACK 01 ↔ 10을 선택합니다. 확대된 시각 요소나 투명해진 요소의 DOM hit-test에 의존하지 않아 경계가 흔들리지 않습니다.

선택 깊이에 따라 여러 surface가 최대 3% 확장되고, 현재 트랙보다 안쪽의 레이어는 5% 확장하면서 페이드됩니다. 반경을 되돌아가면 같은 레이어가 복원됩니다. 전환은 450ms이며, 원 밖으로 나오면 composition을 복원하고 마지막 탐색 트랙은 유지합니다. Hover나 키보드 focus만으로 오디오를 재생하지 않으며, 원 클릭 또는 PLAY 버튼으로 미리듣기를 요청합니다.

오른쪽 컨트롤은 LISTEN / BEHIND 두 개의 별도 버튼입니다. Hover / keyboard focus 시 작은 label을 표시하며 active mode를 보라색 아이콘과 선으로 나타냅니다. 자체 헤더, 대형 페이지 제목, 하단 mode navigation과 푸터는 없으며 오른쪽 컨트롤을 사용합니다. BEHIND 진입 시 hover를 잠그고 150ms 동안 surface를 복원하며 회전을 감속한 뒤 기존 morph를 실행합니다.

수정 검증: 실제 Chromium에서 모든 artwork의 rotation transform이 시간에 따라 바뀌는지, 포인터의 양방향 radial 탐색, 확대·fade·복원, hover autoplay 부재, 클릭 / keyboard 접근, 두 mode tabs, hover 중 morph와 DOM identity 유지, reverse morph, 기존 viewer, 연속 mode 요청, reduced motion 및 responsive widths를 확인했습니다.

## Homepage layout adaptation

1440px에서 섹션 높이는 고정 928px입니다. 상단 여백 66px, 좌우 gutter 60px, interaction 영역 높이 760px로 구성합니다. 앨범 최대 지름은 680px이며, 섹션의 정확한 중앙(X=720px)에 놓입니다. 좌우 대칭 gutter를 제외한 interaction 영역의 50%가 같은 축이므로 padding 때문에 중심이 밀리지 않습니다. 얇은 보라색 가이드가 원 뒤에서 같은 축을 따라 이어지며 pointer 이벤트를 받지 않습니다. BEHIND에서는 기존 제작 타임라인의 연결선을 사용합니다.

LISTEN과 BEHIND는 같은 section 높이를 유지합니다. 트랙 정보는 왼쪽 safe area, 모드 컨트롤은 오른쪽 60px gutter에 정렬됩니다. 원의 layer 비율·반경 판정·회전·hover·morph는 유지하고 배치 좌표와 전체 지름만 조정했습니다. 임시 아트워크와 트랙/비하인드 데이터는 변경하지 않았습니다.

컴포넌트에는 body/html scroll 제어, 100vh 최소 높이, fixed 페이지 레이아웃이 없습니다. index.html은 섹션 실행용이며, 실제 홈페이지에는 위 삽입 예제대로 ComebackProject만 사용하세요. 좁은 화면에서는 기존 세로 배치를 유지하면서 양쪽 모드에 같은 높이를 적용합니다.

검증: 1440px 중심/지름/gutter/높이의 실제 bounding box, 흰 배경, 모드별 동일 높이, 타임라인·미디어 경계, 동일 DOM 유지, 앞뒤 host 요소를 넣었을 때 페이지 스크롤과 다음 섹션 위치를 확인했습니다. 최신 와이어프레임 이미지는 첨부되지 않아 요청 문서의 명시된 수치와 구조를 기준으로 조정했습니다.

## BEHIND timeline scale

1001px 이상 데스크톱에서 왼쪽 타임라인만 확대했습니다. 노드는 26→33px, 행 간격은 44→52px, 단계명은 10→12.5px, 번호는 9→10.5px, 컬럼은 37→44%입니다. 발매 제목은 16→20px이며 release block의 시작점을 stage 기준 610px로 내려 전체 타임라인의 세로 점유를 약 23% 늘립니다. 데스크톱 섹션은 고정 928px이며 발매 영역 아래에 100px 이상의 여백을 확보합니다.

CSS의 `--cp-timeline-*` 변수로 노드 크기, 행 간격, 레이블 오프셋, 연결선, 발매 위치를 관리합니다. positions()가 같은 CSS 변수를 읽어 기존 circle 버튼의 morph 도착 좌표를 계산하므로 별도의 노드를 만들지 않습니다. 오른쪽 media 관련 스타일과 렌더링은 수정하지 않았고, 브라우저에서 썸네일·재생 버튼·메타데이터·제목·설명의 bounding box와 글자 크기가 수정 전과 정확히 일치함을 확인했습니다. 작은 화면은 기존 26px 노드와 44px 행 간격을 유지합니다.


## Fixed desktop section height

1001px 이상 데스크톱에서 height와 min-height를 모두 928px로 지정합니다. 상단 padding 66px, 라벨 14px, stage 상단 여백 34px, stage 760px, 하단 padding 54px를 합쳐 정확히 928px입니다. 기존 900px 배치 대비 위아래 여백만 각각 14px 늘렸으며 원·타임라인·미디어의 크기와 내부 간격은 유지합니다. 두 모드 모두 같은 규칙을 사용하고 viewport 높이에는 의존하지 않습니다. 다음 홈페이지 섹션은 이 928px 경계 바로 다음에 배치할 수 있습니다.

## TRACK FOCUS MODE

LISTEN은 기본 `listenState = explore`로 시작합니다. 최신 동작 기준으로 TRACK 01이 가장 안쪽, TRACK 10이 가장 바깥쪽입니다. 기존 10개의 크기 비율은 유지하고 트랙별 반경 및 stacking 순서만 이 번호 체계에 맞췄습니다. radial hover도 같은 순서의 반경으로 판정합니다.

하단 01–10 버튼은 `setTrackFocus(index)`를 호출합니다. 내부 index는 0–9이며 기존 trackData를 그대로 참조합니다. 선택된 기존 circle 버튼 자체가 `positions('listen').at(-1)`의 geometry로 확장됩니다. 포커스 전용 이미지나 원을 생성하지 않으며 별도의 고정 px 지름도 정의하지 않습니다. TRACK 10을 선택하면 transform의 크기는 바뀌지 않고 다른 레이어가 걷힙니다.

650ms 전환 동안 나머지 원은 4.5% 확장과 작은 분리 이동, opacity를 조합해 퇴장합니다. 선택된 이미지의 독립 회전은 계속됩니다. 숨겨진 원은 포인터와 키보드 탐색에서 제외하고 회전을 일시 중지합니다. 포커스 안에서는 radial hover를 잠그며 번호를 바꾸면 큰 원에서 다른 큰 원으로 직접 전환합니다. 같은 번호 재클릭, 원 바깥 빈 공간 클릭, Escape는 Explore로 복원합니다. 재생·서비스 링크·번호·모드 컨트롤은 빈 공간 클릭으로 처리하지 않습니다. 번호 클릭이나 hover만으로 오디오를 재생하지 않습니다.

진행 중 다른 번호를 누르면 현재 그려진 transform / opacity를 캡처한 뒤 기존 애니메이션을 취소하고 새 대상으로 이어갑니다. 비동기 완료는 focusEpoch로 구분해 이전 요청이 새 상태를 덮어쓰지 못하게 합니다. BEHIND 요청은 200ms 동안 원래 Explore geometry를 복원한 뒤 기존 morph를 실행합니다. BEHIND → LISTEN은 Explore로 돌아옵니다. `destroy()`는 포커스 애니메이션도 취소합니다.

검증: 실제 Chromium에서 01의 중간 확대 프레임, 모든 10개 최종 지름·중심과 TRACK 10 원본 크기의 일치, TRACK 10 불필요한 확대 부재, 원·rotation identity, 선택 정보·번호, rotation 유지, hover 잠금, 컨트롤 보호, 포커스 간 직접 전환, 재클릭/바깥/Escape 복원, 빠른 요청 변경, Focus→BEHIND 및 역방향 Explore 복원, 고정 928px, 좁은 화면, reduced motion, keyboard 및 cleanup을 확인했습니다.

## Separate BEHIND artwork and final chapters

LISTEN circles use `assets/tracks/track-01.png` through `track-10.png`. BEHIND circles and the selected media viewer use `assets/behind/behind_01.png` through `behind_10.png`. Existing track files, uploaded behind files and `.gitkeep` are preserved unchanged.

The ten `behindData` records explicitly define `id`, `step`, the final English `title`, Korean `description`, and `image`. Editing `image` in comebackData.js updates the node, viewer and modal together; animation code does not contain image paths. `thumbnail` remains an alias for compatibility, and `videoTitle` defaults to the final chapter title.

Each original circle button now contains two noninteractive visual images within the same clipped surface. The original track image and its rotation animation stay mounted; the second image is an absolutely positioned BEHIND layer with no layout footprint. The existing FLIP geometry moves the same ten circle buttons. During that movement, only image opacity crossfades over 420ms with a small stagger. Reverse morph fades back to the track image. Reduced-motion uses an 80ms image transition. Incoming images are decoded before the morph, and destroy() cancels the image animations.

Verified in Chromium: all ten final chapter names/descriptions and 1:1 image mapping; unchanged track assets; same circle, inner-image and rotation references through forward/reverse transitions; actual intermediate crossfade frames; node and label selection; matching viewer/modal image; Focus→BEHIND→Explore; rapid mode locks; reduced motion; narrow viewport; cleanup; unchanged 33px nodes, 52px row spacing and fixed 928px section height.


## Dark editorial UI and persistent utilities

기본 배경은 #202124이며 밝은 전경, muted light gray, UNO purple accent를 사용합니다. 원/타임라인/media의 위치·크기와 928px desktop section은 유지합니다. artistData의 JENA / 김지안은 공통 중심축 양옆에 놓이고 두 모드에서 계속 표시됩니다.

중앙 guide는 1px fixed 레이어로 viewport의 top:0부터 bottom:0까지 100vh 높이를 사용합니다. 928px을 유지하는 section 자체에는 viewport height를 적용하지 않습니다. stage bounding box로 계산한 --cp-viewport-axis를 써서 guide와 원/아티스트가 같은 축을 공유합니다. guide는 artwork보다 뒤에 있고 pointer 이벤트를 받지 않습니다.

오른쪽 하단 utility는 고정 위치의 작은 inline SVG + text 컨트롤입니다. 사용자가 제공한 미리보기의 기하학 형태를 inline SVG로 구현했으며 PNG 파일 경로나 외부 asset을 사용하지 않습니다. 소리 끄기/켜기는 기존 Audio 인스턴스와 현재 페이지의 audio/video를 실제 mute/unmute합니다. 새 modal video는 현재 mute 설정을 상속합니다. 자동 재생은 ON/OFF UI 설정만 제공하며, 연속 음원 재생은 아직 연결하지 않았습니다. 이 설정을 켜도 자동으로 음원을 재생하지 않습니다. 두 상태는 모드 전환 동안 유지됩니다.

Archive가 viewport 밖으로 나가거나 destroy()가 호출되면 viewport 고정 guide/utility는 숨겨져 다른 homepage section에 노출되지 않습니다. 기존 transition, image crossfade, track/behind data 및 asset 경로는 변경하지 않았습니다.

검증: 수정 전후 LISTEN/BEHIND의 기존 bounding box 전체 일치, 다크 배경에서 실제 텍스트 contrast >=4.5, 공통 중심축과 viewport guide, mode transition 중 artist/guide 안정성, 페이지 media mute/unmute, autoplay UI state 및 무의도 재생 부재, utility 클릭 시 Focus 유지, 928px 및 viewport resize, offscreen visibility를 Chromium에서 확인했습니다. 기존 10개 circle/image/rotation identity, 양방향 morph와 실제 중간 crossfade 프레임, 모든 BEHIND 데이터/이미지 연결, node/viewer selection, Focus, reduced motion과 cleanup도 재검증했습니다.


## JENA’S NOTE

BEHIND has a small, transparent editorial annotation connected to the existing activeBehind selection. Every behindData entry in `dist/comeback-project/comebackData.js` now has its own temporary `note` paragraph. To replace copy later, edit only that entry’s `note` value. The label reads the selected entry’s step, and the image, title, description and note all use the same selection. No additional selection state or circle objects are created.

At 1440px, Note occupies the existing whitespace between the visible timeline titles and the central axis, with no background, border, shadow, brackets or indicators. Its maximum width is 224px, body type is 11.5px, and height is natural. Text wraps without hardcoded line breaks and supports two to five lines without moving other UI. Compact widths use existing spare space below content so other elements retain their geometry.

Note stays hidden in LISTEN and appears after the original forward morph finishes. Leaving BEHIND fades it away. Changing chapter fades the old content up by 3px over 110ms, swaps the copy, then fades the new content in from 3px below over 170ms. A generation token cancels stale transitions on rapid chapter changes; reduced motion swaps copy immediately. Mode changes and destroy() cancel Note animation without altering the original circle motion or image crossfade.

Verified in Chromium: exact original LISTEN and BEHIND bounding boxes; all 01–10 copy mappings; real intermediate note transition frames; data-only two/three/five-line replacements; no overlap with the timeline, axis or viewer at 1440px; stable 928px height; last-selection-wins behavior; Note hidden in LISTEN and revealed only after morph; preserved circle/image identity, rotation and utility states; responsive bounds, reduced motion and lifecycle cleanup.

## Note follows the selected timeline row

In the desktop whitespace column, the single existing Note block now reads the selected `[data-step]` element’s actual bounding box. Its label center aligns with that row’s center relative to the Note’s offset parent. There is no per-step pixel table, and changes to row spacing or timeline offset are reflected automatically on selection/layout.

A 420ms eased animation moves the Note using the independent CSS `translate` property, leaving the existing appearance transform and text fade separate. Text briefly fades out, the movement begins after a 90ms overlap, copy swaps from the same behindData.note, and the incoming copy fades in while moving. Retargets capture the currently drawn translate before cancelling the prior movement. Mode switches freeze any in-flight position while hiding Note; reverse entry recalculates the selected row. Reduced motion updates immediately, resize recalculates alignment, and destroy() cancels movement. Existing compact-width reserved Note positions are retained to avoid covering content where a third column cannot fit.

Verified in Chromium: all ten row/label center alignments; actual intermediate motion; rapid retargets; one persistent Note DOM; runtime row-gap/top changes; unchanged X and safe section bounds; mode-switch interruption and reverse alignment; original circles/images/rotation, 928px, reduced motion, compact fallback and cleanup. The existing image crossfade, viewer mapping, Focus and morph regression checks also passed. Note copy and all image/data paths remain unchanged.

UPCOMING LIVE는 desktop에서 1024px 높이를 사용하고, Archive wrapper와 동일한 `--uno-dark` 배경 토큰을 재사용합니다. 공통 105px gutter, 가로 grid, 이미지·CTA 크기 및 typography를 유지하며 전체 내부 블록을 세로 중앙에 배치합니다. 라벨·보조 문구는 밝은 muted gray, 제목·날짜·시간은 white를 사용합니다. 작은 화면에서는 기존 자동 높이 배치를 유지합니다.

Hero LIVE NOW의 dot은 `#B7FF3C`이며 크기·위치·효과는 변경하지 않습니다.

UPCOMING LIVE의 이미지는 원본 1440:790 비율과 width 100% / height auto를 사용해 crop과 내부 letterbox 없이 전체 영역을 표시합니다. Desktop에서는 기존 제목과 섹션 경계를 유지하며, 짧아진 이미지 옆에 LIVE SCHEDULE을 세로 중앙 정렬합니다. 이미지 asset·가로 너비·105px gutter·CTA 디자인은 유지합니다.
