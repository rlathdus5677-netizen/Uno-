const asset=name=>new URL(`./assets/${name}`,import.meta.url).href;
const sharedAsset=name=>new URL(`../homepage/assets/figma/${name}`,import.meta.url).href;
export const eventData={
 startsAt:'2026-11-27T00:00:00+09:00',endsAt:'2026-12-24T23:59:59+09:00',period:'11.27 - 12.24',
 hero:asset('hero-background.png'),logo:asset('hero-logo.svg'),chevron:asset('hero-chevron.svg'),
 ticket:asset('ticket.png'),light:asset('benefit-light.svg'),warning:asset('warning.svg'),arrow:asset('arrow-right.svg'),
 // Design sample only: a live vote-count endpoint has not been configured.
 participationCount:'1,734,031',
 moods:[
  {id:'a',label:'MOOD A',title:'아케이드, 핑크',description:'발랄하고 키치한 콘셉트',image:sharedAsset('archive-style-01.png'),imagePosition:'57.5% 50%'},
  {id:'b',label:'MOOD B',title:'하이퍼팝, Y2K',description:'화려한 미래적인 콘셉트',image:sharedAsset('archive-style-02.png'),imagePosition:'25% 50%'},
  {id:'c',label:'MOOD C',title:'겨울, 크리스마스',description:'설레는 홀리데이 감성의 콘셉트',image:sharedAsset('archive-style-03.png'),imagePosition:'92.5% 50%'}
 ],
 steps:[['UNO PROCESS에서','참여하고 싶은 콘텐츠를 선택해요'],['나의 취향대로','컴백 비주얼과 무드에 투표해요'],['투표가 완료되면','티켓 추첨 응모도 자동으로 완료돼요']],
 notices:[
  '이벤트 기간 내 완료된 투표가 자동 응모 대상이 됩니다.',
  '당첨 안내와 상세 운영 기준은 이벤트 종료 후 별도 안내됩니다.',
  'UNO 홈의 세 번째 PROCESS 섹션에서 확인할 수 있습니다.',
  '이벤트 기간은 11.27 - 12.24까지 입니다.',
  '당첨자는 이벤트 페이지에 별도 공지합니다.',
  '티켓 양도·판매 가능 여부는 [검토 후 기입]합니다.'
 ]
};
