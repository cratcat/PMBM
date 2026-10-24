// 설정 상수 (일반 스크립트: 다른 파일에서 전역으로 사용)
// ※ 원본 config.js의 값이 따로 있다면 이 파일의 값만 덮어쓰세요.
const CONFIG = { API_BASE: 'Firebase', GPM_URL: '', SSO: {} };

// edit: 작업 등록/수정/이동 가능, manage: 설비 관리·측정값 삭제 가능
const ROLES = {
  admin:    { label: '관리자',   edit: true,  manage: true  },
  engineer: { label: '엔지니어', edit: true,  manage: false },
  viewer:   { label: '조회자',   edit: false, manage: false }
};

const ST = { planned: '예정', progress: '진행 중', done: '완료' };

// 달력 위에 표시되는 작업 템플릿 [제목, 'PM'|'BM']
const TPL = [
  ['월간 챔버 클린', 'PM'],
  ['필터 교체', 'PM'],
  ['펌프 점검', 'PM'],
  ['가스라인 누설 점검', 'BM'],
  ['RF 매칭 조정', 'BM']
];

// 파티클 기준 (실제 Spec 값으로 수정하세요)
const PARTICLE = { size: '0.12㎛ 이상', unit: 'ea', warn: 10, limit: 20, kinds: ['정기', 'PM 후', 'BM 후'] };

const DEMO = []; // Firebase 로그인을 쓰므로 데모 계정은 사용하지 않음

// 현재 로그인한 사용자가 작업을 편집할 수 있는지
const can = () => !!(S.user && ROLES[S.user.role] && ROLES[S.user.role].edit);
