const asset = name => new URL(`./assets/${name}`, import.meta.url).href;
export const siteData={name:'UNO ENTERTAINMENT',title:'UNO Entertainment — UNIQUE + ONE',logo:asset('figma/header-logo-latest.svg')};
export const navigationData=[{label:'HOME',href:'#home'},{label:'PROCESS',href:'#process'},{label:'JOIN',href:'#join'},{label:'LIVE',href:'#upcoming-live'}];
// Homepage visuals and copy are placeholders. Change these paths without editing layout code.
export const heroData={eyebrow:'LIVE NOW',headline:'JENA의\n컴백을 도와줘!',metadata:'ARTIST 02 · COMEBACK TALK LIVE',cta:'라이브 참여하기',image:asset('figma/hero-live.png'),imagePosition:'50% 50%',alt:'보라색과 라임색 스타일링을 한 JENA의 라이브 비주얼',previewTitle:'JENA · COMEBACK TALK LIVE',previewDescription:'라이브 참여 기능을 준비하고 있어요. 다음 라이브 일정을 확인하고, 아티스트의 새로운 순간을 함께 기다려주세요.'};
export const processData={initialCardId:'comeback-look',label:'PROCESS',headline:'JENA의 컴백에\n직접 참여하세요.',filters:[{id:'all',label:'ALL'},{id:'daily',label:'DAILY'},{id:'album',label:'ALBUM'},{id:'stage',label:'STAGE'}]};
// Each card owns its image path; replace these independently without changing carousel logic.
export const artistProcessData=[
 {id:'album-cover',image:asset('process-07.png'),category:'album',title:'앨범 커버',description:'이번 앨범의 얼굴을 함께 정해주세요.',alt:'앨범의 비주얼을 의논하는 JENA',artist:'JENA'},
 {id:'shooting-log',image:asset('process-01.png'),category:'daily',title:'촬영 브이로그',description:'보고 싶은 컴백 준비 순간을 알려주세요.',alt:'뮤직비디오 촬영 현장의 JENA',artist:'JENA'},
 {id:'comeback-look',image:asset('process-02.png'),category:'album',title:'컴백 의상',description:'JENA의 컴백 룩에 의견을 더해주세요.',alt:'새로운 컴백 룩을 준비하는 JENA',artist:'JENA'},
 {id:'stage-concept',image:asset('process-03.png'),category:'stage',title:'무대 컨셉',description:'이번 무대에서 보고 싶은 분위기를 알려주세요.',alt:'무대에 오르기 전의 JENA',artist:'JENA'},
 {id:'track-pick',image:asset('process-05.png'),category:'album',title:'수록곡 픽',description:'가장 먼저 듣고 싶은 곡을 알려주세요.',alt:'스튜디오에서 음악을 만드는 JENA',artist:'JENA'},
 {id:'letter-to-jena',image:asset('process-08.png'),category:'daily',title:'JENA에게',description:'컴백을 준비하는 JENA에게 한마디를 남겨주세요.',alt:'팬들과 이야기를 나누는 JENA',artist:'JENA'},
 {id:'choreography-point',image:asset('process-06.png'),category:'stage',title:'안무 포인트',description:'이번 무대에서 기대되는 순간을 골라보세요.',alt:'연습실에서 안무를 준비하는 JENA',artist:'JENA'},
 {id:'comeback-day',image:asset('process-04.png'),category:'stage',title:'컴백 D-DAY',description:'함께 만든 컴백의 순간을 확인하세요.',alt:'컴백 무대 위의 JENA',artist:'JENA'}
];
export const upcomingLiveData={label:'UPCOMING LIVE',headline:'다음 라이브를\n놓치지 마세요.',image:asset('upcoming-live.png'),alt:'팬들과 컴백 이야기를 나누는 JENA',eyebrow:'LIVE SCHEDULE',dateLabel:'11.20 FRI',timeLabel:'20:00 KST',startsAt:'2026-11-20T20:00:00+09:00',durationMinutes:45,title:'아티스트와 함께하는\n컴백 비하인드 라이브',description:'아직 들려주지 못한 이야기부터, 여러분들이 궁금했던 순간까지. JENA와 함께 컴백의 다음 장을 열어보세요.',cta:'알림 신청하기',notice:'입력한 연락처는 라이브 알림 전송에만 사용됩니다.',calendarTitle:'JENA — 컴백 비하인드 라이브',reminderDescription:'라이브 알림 기능은 준비 중입니다. 캘린더에 일정을 저장해두세요. 캘린더 파일에는 시작 10분 전 알림이 포함되며, 실제 알림은 기기의 캘린더 설정에 따라 동작합니다.'};
export const brandData={label:'UNO ENTERTAINMENT',words:[{parts:[{text:'UN',accent:true},{text:'IQUE',accent:false}]},{parts:[{text:'O',accent:true},{text:'NE',accent:false}]}],symbol:asset('figma/brand-logo-latest.svg'),aboutLabel:'ABOUT UNO',aboutTitle:'UNIQUE + ONE',aboutDescription:'서로 다른 개성과 하나의 연결. UNO는 아티스트와 팬이 컴백의 과정을 함께 나누는 새로운 경험을 만들어갑니다.'};
export const socialLinks=[{name:'YouTube',icon:'youtube',image:asset('figma/youtube.svg'),url:'#'},{name:'Weibo',icon:'weibo',image:asset('figma/weibo.svg'),url:'#'},{name:'Facebook',icon:'facebook',image:asset('figma/facebook.svg'),url:'#'},{name:'Instagram',icon:'instagram',image:asset('figma/instagram.svg'),url:'#'},{name:'X',icon:'x',image:asset('figma/x.svg'),url:'#'}];
export const footerData={name:'UNO',tagline:'UNIQUE + ONE',links:[{label:'개인정보처리방침',action:'privacy'},{label:'비즈니스 문의',action:'business'}],notice:'UNO Entertainment의 모든 콘텐츠는 저작권의 보호를 받고 있습니다.',copyright:'©UNO Entertainment RIGHTS RESERVED.'};

export const uiAssets={heroPlay:asset('figma/hero-play-latest.svg'),topChevron:asset('figma/chevron-up.svg'),liveChevron:asset('figma/chevron-right.svg')};

export const liveContactData={email:{label:"이메일",placeholder:"이메일 주소를 입력해주세요.",type:"email",autocomplete:"email"},phone:{label:"휴대폰",placeholder:"휴대폰 번호를 입력해주세요.",type:"tel",autocomplete:"tel"}};
