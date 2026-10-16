# 백엔드 연동 가이드

## 데이터 형식

```jsonc
// Task
{ "id": "t17", "eq": "CVD-01", "type": "PM",            // PM | BM
  "title": "월간 챔버 클린", "date": "2026-10-20",       // YYYY-MM-DD
  "status": "planned",                                  // planned | progress | done
  "owner": "박엔지니어", "note": "", "series": "" }      // series: 반복 일정 묶음 ID
// Equipment
{ "id": "CVD-01", "kind": "CVD", "line": "Bay A" }
// Log
{ "at": "2026-10-17 14:32", "user": "김관리", "act": "이동",
  "id": "t17", "eq": "CVD-01", "title": "월간 챔버 클린", "detail": "날짜 2026-10-20→2026-10-25" }
```

## REST API

모든 요청은 쿠키 세션(`credentials: 'include'`)을 사용합니다. 세션이 없거나 만료되면 `401`을 돌려주세요. 화면이 로그인으로 돌아갑니다.

| 메서드 | 경로 | 설명 | 필요한 역할 |
| --- | --- | --- | --- |
| GET | `/tasks` | 작업 전체 | 모두 |
| PUT | `/tasks/:id` | 작업 등록/수정(upsert) | engineer, admin |
| DELETE | `/tasks/:id` | 작업 삭제 | engineer, admin |
| GET | `/equipment` | 설비 목록 | 모두 |
| PUT | `/equipment/:id` | 설비 등록/수정 | admin |
| GET | `/logs` | 이력(최신순) | 모두 |
| POST | `/logs` | 이력 추가 | engineer, admin |

- 권한은 서버에서 반드시 다시 검사하세요. 화면의 권한 제어만으로는 보호되지 않습니다.
- 이력의 `user`는 클라이언트 값을 믿지 말고 서버가 세션 사용자로 덮어쓰세요. 가능하면 작업 변경과 이력 기록을 서버에서 한 트랜잭션으로 처리하세요.
- 프론트와 API가 다른 도메인이면 CORS에서 `Access-Control-Allow-Credentials: true`와 허용 오리진을 명시하세요. 쿠키 세션이므로 `SameSite` 설정과 CSRF 방어(토큰 또는 커스텀 헤더 검증)도 필요합니다.

## SAML SSO

SAML은 브라우저 단독으로 처리할 수 없어 백엔드가 서비스 제공자(SP)가 됩니다.

```
브라우저 → GET {loginUrl}?returnTo=<현재 주소>
        → 백엔드가 AuthnRequest 생성 → IdP로 리다이렉트
IdP 인증 → POST {ACS} (SAMLResponse)
        → 백엔드가 응답 검증 → 세션 쿠키 발급 → returnTo로 리다이렉트
화면    → GET {meUrl} → { "name": "...", "role": "admin|engineer|viewer" }
```

필요한 엔드포인트 예시: `GET /auth/saml/login`, `POST /auth/saml/acs`, `GET /auth/saml/metadata`, `GET /auth/saml/logout`, `GET /auth/me`.

체크리스트

- 응답 서명, Audience, `NotOnOrAfter`, `InResponseTo`를 검증합니다.
- IdP의 그룹 속성을 역할로 매핑합니다(예: `FAB-PM-ADMIN`→admin, `FAB-PM-ENG`→engineer, 그 외→viewer).
- `returnTo`는 허용 목록과 비교해 오픈 리다이렉트를 막습니다.
- SP 메타데이터(`/auth/saml/metadata`)를 IdP 담당자에게 전달해 등록합니다.
- 권장 라이브러리: Node `@node-saml/passport-saml`, Python `python3-saml`, Java Spring Security SAML2.
