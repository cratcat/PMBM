# FAB 설비 PM/BM 관리

반도체 설비의 예방정비(PM)와 고장정비(BM)를 달력, 보드, 주간 표로 관리하는 웹 프론트엔드입니다.
빌드 도구 없이 정적 파일만으로 동작하며, 서버 주소를 설정하면 REST API와 SAML SSO에 연결됩니다.

## 주요 기능

- 월간 캘린더, 진행 현황(상태별 보드), 설비별 주간, 대시보드, 변경 이력, 설비 관리 탭
- 드래그 앤 드롭: 날짜·상태·설비 변경, Alt+드롭으로 복사, 템플릿을 달력에 끌어다 놓아 작업 생성
- 반복 PM 자동 생성(매주, 2주, 매월, 3개월, 6개월)
- 파티클 관리: 측정값 입력, 경고/한도 판정, 추이 그래프, 연속 상승 감지, PM 후 측정 대기, 한도 초과 시 BM 등록 연결
- Spec-out 주기표: 설비별 한도 초과 횟수를 1·3·6개월 단위로 비교, 평균 주기와 마지막 발생일 표시
- 파티클 Spec 현황표: 3개월 단위 설비×일자 표(Spec IN 초록, Spec OUT 빨강, 미측정 노랑), GPM의 TIP 유무 표시
- 담당자·설비·PM/BM 필터, 엑셀(xlsx) 내보내기
- SAML SSO와 역할별 권한(관리자, 엔지니어, 조회자)

## 실행

```bash
# 방법 1: Python
python3 -m http.server 8080
# 방법 2: Node
npx serve .
```

브라우저에서 `http://localhost:8080`을 엽니다. `API_BASE`가 비어 있으면 데모 데이터(브라우저 localStorage)로 동작하고, 로그인 화면에서 데모 계정을 고를 수 있습니다.

## 폴더 구조

```
index.html              진입 페이지 (스크립트 로드 순서가 중요합니다)
src/css/style.css       스타일(라이트/다크 테마 변수 포함)
src/js/
  config.js             서버·SSO 주소, 역할, 상태, 템플릿 설정
  utils.js, state.js    날짜·DOM 유틸, 전역 상태와 권한 확인
  api.js                서버(REST) 또는 데모 저장소 입출력
  helpers.js            탭 등록, 필터, 이력 기록, 반복 일정, 엑셀 내보내기
  tabs/*.js             탭 하나당 파일 하나 (particle.js = 파티클 관리, particle-grid.js = Spec 현황표)
  view.js               로그인·헤더·탭 렌더링, 작업 등록/수정 창
  events.js             클릭·필터·드래그 앤 드롭 이벤트
  main.js               SSO 세션 확인 후 첫 렌더링
docs/BACKEND.md         서버 API 명세와 SAML 연동 가이드
```

스크립트는 ES 모듈이 아니라 일반 스크립트이며, `index.html`의 로드 순서대로 전역 변수를 공유합니다. 새 파일을 추가하면 `index.html`에 순서에 맞게 등록하세요.

## 설정

`src/js/config.js`에서 수정합니다.

| 항목 | 설명 |
| --- | --- |
| `API_BASE` | REST API 주소. 비우면 데모 모드 |
| `GPM_URL` | GPM TIP 조회 주소. 비우면 `API_BASE/gpm`(백엔드 중계) 또는 데모 |
| `SSO.loginUrl` | 백엔드의 SAML 로그인 시작 주소 |
| `SSO.meUrl` | 로그인 사용자 정보(`{name, role}`)를 돌려주는 주소 |
| `SSO.logoutUrl` | 로그아웃(SLO) 주소 |
| `TPL` | 달력 위에 표시되는 작업 템플릿 `[제목, 'PM'|'BM']` |

## 기능 추가 방법 (새 탭)

1. `src/js/tabs/`에 파일을 만들고 `registerTab`으로 등록합니다.
2. `index.html`의 `tabs/log.js` 아래에 `<script defer src>` 한 줄을 추가합니다.

```js
registerTab({id:'my', label:'내 탭', roles:['admin','engineer'], render(){ return '<div>내용</div>'; }});
```

`roles`를 생략하면 모든 역할에 보입니다. 화면의 권한 제어는 편의 기능이며, 실제 권한 검증은 반드시 서버에서 해야 합니다.

## Git에 올리기

```bash
git init
git add .
git commit -m "feat: PM/BM 관리 웹 프론트엔드 초기 커밋"
git branch -M main
git remote add origin <저장소 주소>
git push -u origin main
```

## 알려진 제한

- 반복 일정은 개별 작업으로 생성되며 일괄 수정·삭제는 아직 없습니다.
- 엑셀 내보내기는 외부 CDN의 SheetJS를 사용합니다. 사내망에서 막히면 파일을 내려받아 `index.html`의 경로를 바꾸세요.
- 라이선스는 정해지지 않았습니다. 저장소 정책에 맞게 `LICENSE`를 추가하세요.
