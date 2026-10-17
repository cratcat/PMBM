// 설정: 서버/SSO 연결 지점, 역할, 템플릿, 상태 정의
/* ========= 설정: 서버/SSO 연결 지점 =========
   API_BASE를 채우면 mock 대신 실제 서버(REST)를 호출합니다.
   GET /tasks, PUT /tasks/:id, DELETE /tasks/:id, GET /equipment, PUT /equipment/:id
   SAML SSO: 로그인 버튼은 백엔드(SP)의 loginUrl로 이동하고, IdP 인증 후 백엔드가 세션 쿠키를 발급합니다.
        meUrl(GET)이 {name, role}을 돌려주면 그 role로 권한이 적용됩니다(role: admin/engineer/viewer). */
const CONFIG={API_BASE:'',GPM_URL:'',SSO:{loginUrl:'',meUrl:'',logoutUrl:''}};
const TPL=[['챔버 클린','PM'],['히터/RF 점검','PM'],['필터·O-ring 교체','PM'],['가스 라인 점검','PM'],['긴급 고장 수리','BM']];
const ROLES={admin:{label:'관리자',edit:true,manage:true},engineer:{label:'엔지니어',edit:true},viewer:{label:'조회자'}};
const DEMO=[{name:'김관리',role:'admin'},{name:'박엔지니어',role:'engineer'},{name:'이조회',role:'viewer'}];
const ST={planned:'예정',progress:'진행중',done:'완료'};

// 파티클 관리 기준. 아래 숫자는 예시이므로 반드시 실제 스펙(크기, 단위, 경고/한도)으로 교체하세요.
const PARTICLE={size:'≥0.12µm',unit:'개/웨이퍼',warn:15,limit:20,kinds:['정기','PM 후','BM 후']};
