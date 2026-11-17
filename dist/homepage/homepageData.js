const asset = name => new URL(`./assets/${name}`, import.meta.url).href;
export const siteData={name:'UNO ENTERTAINMENT',title:'UNO Entertainment — UNIQUE + ONE',logo:asset('uno-logo.svg')};
export const navigationData=[{label:'HOME',href:'#home'},{label:'PROCESS',href:'#process'},{label:'JOIN',href:'#join'},{label:'LIVE',href:'#upcoming-live'}];
// Homepage visuals and copy are placeholders. Change these paths without editing layout code.
export const heroData={eyebrow:'LIVE NOW',headline:'너만의 아티스트의\n성장에 참여해봐 !',metadata:'ARTIST 02 · COMEBACK TALK LIVE',cta:'라이브 참여하기',image:asset('hero-live.png'),imagePosition:'58% 42%',alt:'아티스트가 팬들과 이야기하는 라이브 장면',previewTitle:'JENA · COMEBACK TALK LIVE',previewDescription:'라이브 참여 기능을 준비하고 있어요. 다음 라이브 일정을 확인하고, 아티스트의 새로운 순간을 함께 기다려주세요.'};
export const processData={label:'PROCESS',headline:'아티스트의 컴백에\n직접 참여하세요.',filters:[{id:'all',label:'ALL'},{id:'daily',label:'DAILY'},{id:'album',label:'ALBUM'},{id:'stage',label:'STAGE'}]};
export const artistProcessData=[
 {id:'shooting-log',image:asset('process-01.png'),alt:'뮤직비디오 촬영 현장의 아티스트',title:'촬영 브이로그',artist:'JENA',category:'daily',series:'Weekend log',description:'카메라가 꺼진 뒤의 표정까지. 촬영장에서 보낸 하루를 가장 가까이에서 만나보세요.'},
 {id:'comeback-look',image:asset('process-02.png'),alt:'새로운 컴백을 준비하는 아티스트',title:'컴백 의상',artist:'JENA',category:'album',series:'1st mini album',description:'이번 앨범의 분위기를 완성하는 작은 선택들. 새로운 모습에 담긴 이야기를 나눕니다.'},
 {id:'stage-concept',image:asset('process-03.png'),alt:'무대에 오르기 전의 아티스트',title:'무대 컨셉',artist:'JENA',category:'daily',series:'Weekend log',description:'하나의 무대를 위해 쌓아가는 이미지와 감정. 아티스트가 그리는 장면을 함께 살펴보세요.'},
 {id:'artist-content',image:asset('process-04.png'),alt:'컴백 무대 위의 아티스트',title:'ARTIST CONTENT',artist:'JENA',category:'stage',series:'Weekend log',description:'드디어 무대 위에서 만나는 새로운 챕터. 함께 기다려온 순간을 기록합니다.'},
 {id:'album-note',image:asset('process-05.png'),alt:'스튜디오에서 음악을 만드는 아티스트',title:'앨범 노트',artist:'JENA',category:'album',series:'AFTERIMAGE',description:'첫 멜로디에서 마지막 트랙까지. 이번 앨범의 소리가 만들어지는 과정을 들여다봅니다.'},
 {id:'practice-room',image:asset('process-06.png'),alt:'연습실에서 안무를 연습하는 아티스트',title:'연습실에서',artist:'JENA',category:'stage',series:'Practice log',description:'익숙해질 때까지, 한 번 더. 무대 밖에서 보내는 시간을 함께 따라가보세요.'}
];
export const upcomingLiveData={label:'UPCOMING LIVE',headline:'다음 라이브를\n놓치지 마세요.',image:asset('upcoming-live.png'),alt:'팬들과 컴백 이야기를 나누는 JENA',eyebrow:'LIVE SCHEDULE',dateLabel:'11.20 FRI',timeLabel:'20:00 KST',startsAt:'2026-11-20T20:00:00+09:00',durationMinutes:45,title:'아티스트와 함께하는\n컴백 비하인드 라이브',description:'아직 들려주지 못한 이야기부터, 여러분이 궁금했던 순간까지. JENA와 함께 컴백의 다음 장을 열어보세요.',cta:'라이브 알림 신청',notice:'시작 10분 전 알림을 보내드립니다.',calendarTitle:'JENA — 컴백 비하인드 라이브',reminderDescription:'라이브 알림 기능은 준비 중입니다. 캘린더에 일정을 저장해두세요. 캘린더 파일에는 시작 10분 전 알림이 포함되며, 실제 알림은 기기의 캘린더 설정에 따라 동작합니다.'};
export const brandData={label:'UNO ENTERTAINMENT',words:[{text:'UNIQUE',accent:false},{text:'ONE',accent:true}],symbol:asset('uno-logo.svg'),aboutLabel:'ABOUT UNO',aboutTitle:'UNIQUE + ONE',aboutDescription:'서로 다른 개성과 하나의 연결. UNO는 아티스트와 팬이 컴백의 과정을 함께 나누는 새로운 경험을 만들어갑니다.'};
export const socialLinks=[{name:'YouTube',icon:'youtube',url:'#'},{name:'TikTok',icon:'tiktok',url:'#'},{name:'Facebook',icon:'facebook',url:'#'},{name:'Instagram',icon:'instagram',url:'#'},{name:'X',icon:'x',url:'#'}];
export const footerData={tagline:'UNIQUE + ONE',links:[{label:'개인정보처리방침',action:'privacy'},{label:'비즈니스 문의',action:'business'}],notice:'UNO Entertainment의 모든 콘텐츠는 저작권의 보호를 받습니다.',copyright:'© UNO Entertainment RIGHTS RESERVED.',prototypeNotice:'일정과 콘텐츠, 정책 문구는 홈페이지 시안을 위한 예시입니다.'};
