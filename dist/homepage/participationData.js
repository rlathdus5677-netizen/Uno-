const image = n => new URL(`./assets/figma/archive-style-${String(n).padStart(2,'0')}.png`, import.meta.url).href;

// Participation content is independent of the carousel's cards and controller.
export const participationData = {
 'comeback-look': {
  type: 'artist-archive',
  title: '이번 컴백, 어떤 모습으로 만날까요?',
  description: '아티스트의 무대에서 보고 싶은 스타일을 골라주세요.',
  pageSize: 8,
  items: [
   {id:'arcade',title:'아케이드,핑크,캐주얼',votes:1923903},
   {id:'hyperpop',title:'퍼플,라임 그린,하이퍼팝,Y2K',votes:1453773},
   {id:'christmas',title:'겨울,크리스마스',votes:976325},
   {id:'black',title:'YG,블랙,강함',votes:927512},
   {id:'fairytale',title:'동화,놀이동산,겨울',votes:889641},
   {id:'fantasy',title:'판타지,자연,젤다의전설',votes:854115},
   {id:'western',title:'웨스턴 무드,미국 서부',votes:834112},
   {id:'bohemian',title:'보헤미안,예술가',votes:800034}
  ].map((item,index)=>({...item,image:image(index+1),order:index}))
 }
};
