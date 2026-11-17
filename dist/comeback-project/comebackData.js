const asset = name => new URL(`./assets/tracks/${name}`, import.meta.url).href;
export const albumData = {sectionLabel:'COMEBACK ARCHIVE',artist:'UNO COLLECTIVE',title:'AFTERIMAGE',edition:'THE 1ST FULL ALBUM',year:'2026',intro:'Every sound has a beginning.\nFind yours in the space between.',description:'Ten tracks. One unfolding story.',duration:'32:48'};
const titles=['FIRST LIGHT','IN THE STATIC','MIDNIGHT CALL','SLOW MOTION','AFTERIMAGE','BETWEEN US','SOFT COLLISION','OUT OF FRAME','STILL HERE','A NEW BEGINNING'];
export const trackData=titles.map((title,i)=>({id:i+1,title,cover:asset(`track-${String(i+1).padStart(2,'0')}.png`),audio:'',spotifyUrl:'',youtubeMusicUrl:'',previewDuration:60,duration:['2:48','3:12','3:36','3:09','3:42','2:56','3:28','3:01','3:26','3:30'][i],rotation:{duration:[52,64,46,70,56,42,62,48,68,58][i],direction:i%2?-1:1}}));
const behindAsset = name => new URL(`./assets/behind/${name}`, import.meta.url).href;
export const behindData = [
  {id:1,step:'01',title:'THE BEGINNING',description:'첫 기획 회의',image:behindAsset('behind_01.png')},
  {id:2,step:'02',title:'FIRST SHARE',description:'첫 시안 팬 공유',image:behindAsset('behind_02.png')},
  {id:3,step:'03',title:'MAKING THE SOUND',description:'작곡·멜로디 제작',image:behindAsset('behind_03.png')},
  {id:4,step:'04',title:'VOICE RECORDING',description:'보컬 녹음',image:behindAsset('behind_04.png')},
  {id:5,step:'05',title:'SECOND SHARE',description:'제작 중간 팬 소통',image:behindAsset('behind_05.png')},
  {id:6,step:'06',title:'PRACTICE LOG',description:'안무 연습',image:behindAsset('behind_06.png')},
  {id:7,step:'07',title:'ON THE SET',description:'뮤직비디오 촬영',image:behindAsset('behind_07.png')},
  {id:8,step:'08',title:'FINAL SHARE',description:'컴백 직전 팬 소통',image:behindAsset('behind_08.png')},
  {id:9,step:'09',title:'BACKSTAGE',description:'음악방송 대기실 / 무대 직전',image:behindAsset('behind_09.png')},
  {id:10,step:'10',title:'THE DAY',description:'컴백 무대',image:behindAsset('behind_10.png')}
].map(entry=>({...entry,videoTitle:entry.title,thumbnail:entry.image,video:'',ctaLabel:'WATCH BEHIND',ctaUrl:'',caption:`CHAPTER ${entry.step} / THE MAKING OF AFTERIMAGE`}));
export const releaseData={eyebrow:'TODAY',title:'COMEBACK RELEASED',primaryCta:{label:'WATCH MV',url:''},secondaryCta:{label:'LISTEN NOW',url:''}};
export const motionData={duration:1120,stagger:35,nodeSize:26};
