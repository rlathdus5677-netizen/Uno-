# UNO — Comeback Project

기존 UNO 홈페이지에 삽입할 수 있는 독립형 인터랙티브 프로토타입입니다. 홈페이지 전체가 아니라 LISTEN ↔ BEHIND 섹션만 구현합니다. 가상의 앨범 AFTERIMAGE와 모든 아트워크·문구는 임시 콘텐츠입니다.

## 로컬 실행

```sh
npm run dev
# http://localhost:3000
npm run check
```

설치할 런타임 의존성은 없습니다. ES modules, Web Animations API, ResizeObserver를 지원하는 최신 브라우저에서 실행됩니다.

## 콘텐츠 교체

`dist/comeback-project/comebackData.js`만 수정합니다.

- `albumData`: 앨범명, 아티스트, 연도, 소개
- `trackData`: 트랙명, cover, audio, Spotify / YouTube Music URL, 재생 시간, 회전 설정
- `behindData`: 단계명, 제목, 설명, 썸네일, video, CTA 라벨과 링크
- `releaseData`: TODAY, 발매 문구, 발매 CTA
- `motionData`: 이동 시간, stagger, 노드 크기

`cover`와 `thumbnail`은 이미지 URL이며 기존 파일만 교체해도 됩니다. 음원은 `audio`에 URL을 설정하면 작동합니다. 한 번에 한 트랙만 재생되고 60초 이후 정지합니다. 빈 URL은 이동하지 않으며 준비 중 안내가 표시됩니다. 비하인드 `video`를 연결하면 모달에서 네이티브 비디오 플레이어를 사용합니다. `ctaUrl`을 연결하면 외부 링크로 작동합니다.

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

오른쪽 컨트롤은 LISTEN / BEHIND 두 개의 별도 버튼입니다. Hover / keyboard focus 시 작은 label을 표시하며 active mode를 보라색 아이콘과 선으로 나타냅니다. 기존 하단 mode controls도 그대로 동작합니다. BEHIND 진입 시 hover를 잠그고 150ms 동안 surface를 복원하며 회전을 감속한 뒤 기존 morph를 실행합니다.

수정 검증: 실제 Chromium에서 모든 artwork의 rotation transform이 시간에 따라 바뀌는지, 포인터의 양방향 radial 탐색, 확대·fade·복원, hover autoplay 부재, 클릭 / keyboard 접근, 두 mode tabs, hover 중 morph와 DOM identity 유지, reverse morph, 기존 viewer, 연속 mode 요청, reduced motion 및 responsive widths를 확인했습니다.
