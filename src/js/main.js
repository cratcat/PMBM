import { initAuthListener } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. 앱 실행 시 로그인 상태 감지 시작
  initAuthListener((user) => {
    if (user) {
      console.log("로그인 상태:", user.email);
      // TODO: 로그인된 사용자가 확인되었을 때 실행할 UI 렌더링 함수 호출
    } else {
      console.log("로그아웃 상태: 로그인이 필요합니다.");
      // TODO: 로그인 화면 표시 또는 로그인 페이지로 유도하는 로직
    }
  });

  // 기존에 작성되셨던 다른 초기화 코드들...
});
