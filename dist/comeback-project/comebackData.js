const asset = name => new URL(`./assets/tracks/${name}`, import.meta.url).href;
export const albumData = {sectionLabel:'COMEBACK ARCHIVE',artist:'UNO COLLECTIVE',title:'AFTERIMAGE',edition:'THE 1ST FULL ALBUM',year:'2026',intro:'Every sound has a beginning.\nFind yours in the space between.',description:'Ten tracks. One unfolding story.',duration:'32:48'};
const titles=['FIRST LIGHT','IN THE STATIC','MIDNIGHT CALL','SLOW MOTION','AFTERIMAGE','BETWEEN US','SOFT COLLISION','OUT OF FRAME','STILL HERE','A NEW BEGINNING'];
export const trackData=titles.map((title,i)=>({id:i+1,title,cover:asset(`track-${String(i+1).padStart(2,'0')}.png`),audio:'',spotifyUrl:'',youtubeMusicUrl:'',previewDuration:60,duration:['2:48','3:12','3:36','3:09','3:42','2:56','3:28','3:01','3:26','3:30'][i],rotation:{duration:[52,64,46,70,56,42,62,48,68,58][i],direction:i%2?-1:1}}));
const behindAsset = name => new URL(`./assets/behind/${name}`, import.meta.url).href;
// Temporary artist copy: edit each note value here; UI and animation need no changes.
export const behindData = [
  {id:1,step:'01',title:'THE BEGINNING',description:'첫 기획 회의',image:behindAsset('behind_01.png'),note:'처음엔 막연했던 장면들이 조금씩 선명해지고 있어요. 같이 이야기했던 순간들이 이번 앨범의 시작이 된 것 같아요.'},
  {id:2,step:'02',title:'FIRST SHARE',description:'첫 시안 팬 공유',image:behindAsset('behind_02.png'),note:'처음 보여주는 순간이라 조금 긴장했어요. 반응을 보고 나니 우리가 가려던 방향도 조금 더 또렷해졌어요.'},
  {id:3,step:'03',title:'MAKING THE SOUND',description:'작곡·멜로디 제작',image:behindAsset('behind_03.png'),note:'요즘은 하루 종일 이 멜로디를 듣고 있어요. 함께 나눴던 분위기를 생각하면서 우리다운 소리를 찾아가는 중이에요.'},
  {id:4,step:'04',title:'VOICE RECORDING',description:'보컬 녹음',image:behindAsset('behind_04.png'),note:'오늘은 오래 녹음했어요. 어떤 감정으로 들렸으면 좋을지 생각하면서 한 소절씩 다시 불러봤어요.'},
  {id:5,step:'05',title:'SECOND SHARE',description:'제작 중간 팬 소통',image:behindAsset('behind_05.png'),note:'처음보다 훨씬 많은 것들이 만들어졌어요. 중간 과정을 함께 나누다 보니 저도 놓쳤던 부분들이 새롭게 보이더라고요.'},
  {id:6,step:'06',title:'PRACTICE LOG',description:'안무 연습',image:behindAsset('behind_06.png'),note:'연습실에서 보내는 시간이 점점 길어지고 있어요. 무대에서 보여줄 순간을 생각하면 힘들다가도 다시 집중하게 돼요.'},
  {id:7,step:'07',title:'ON THE SET',description:'뮤직비디오 촬영',image:behindAsset('behind_07.png'),note:'상상으로만 보던 장면들이 오늘 실제 화면이 됐어요. 우리가 이야기해온 분위기가 하나씩 연결되는 게 신기했어요.'},
  {id:8,step:'08',title:'FINAL SHARE',description:'컴백 직전 팬 소통',image:behindAsset('behind_08.png'),note:'이제 정말 얼마 안 남았어요. 지금까지 함께 봐온 과정들이 있어서 이번 컴백은 조금 다르게 느껴져요.'},
  {id:9,step:'09',title:'BACKSTAGE',description:'음악방송 대기실 / 무대 직전',image:behindAsset('behind_09.png'),note:'무대 바로 전이에요. 지금까지 같이 쌓아온 장면들을 생각하니까 긴장보다 설렘이 더 큰 것 같아요.'},
  {id:10,step:'10',title:'THE DAY',description:'컴백 무대',image:behindAsset('behind_10.png'),note:'드디어 오늘이에요. 준비하는 동안 함께했던 순간들까지 전부 이번 무대 안에 잘 담겼으면 좋겠어요.'}
].map(entry=>({...entry,videoTitle:entry.title,thumbnail:entry.image,video:'',ctaLabel:'WATCH BEHIND',ctaUrl:'',caption:`CHAPTER ${entry.step} / THE MAKING OF AFTERIMAGE`}));
export const releaseData={eyebrow:'TODAY',title:'COMEBACK RELEASED',primaryCta:{label:'WATCH MV',url:''},secondaryCta:{label:'LISTEN NOW',url:''}};
export const motionData={duration:1120,stagger:35,nodeSize:26};

export const artistData={latin:'JENA',korean:'김지안'};

// Inner-to-outer LISTEN diameters; TRACK 10 remains the unchanged outer reference.
export const listenLayoutData={diameterRatios:[.14,.23,.30,.40,.48,.59,.67,.79,.88,1]};
