import { initAuthListener } from "./state.js";
import { loginUser, logoutUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");

  // 로그인 상태 감지 리스너 실행
  initAuthListener((user) => {
    if (user) {
      // [로그인 성공 상태] 메인 화면 렌더링
      console.log("로그인됨:", user.email);
      renderMainDashboard(appContainer, user);
    } else {
      // [로그아웃 상태] 로그인 입력 폼 렌더링
      console.log("로그인이 필요합니다.");
      renderLoginForm(appContainer);
    }
  });
});

// 로그인 화면 렌더링 함수
function renderLoginForm(container) {
  container.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f6f9;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 350px;">
        <h2 style="margin-bottom: 20px; text-align: center; color: #333;">PM/BM 시스템 로그인</h2>
        <form id="login-form">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">이메일</label>
            <input type="email" id="login-email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" />
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">비밀번호</label>
            <input type="password" id="login-password" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" />
          </div>
          <button type="submit" style="width: 100%; background: #007bff; color: white; border: none; padding: 10px; border-radius: 4px; font-size: 16px; cursor: pointer;">로그인</button>
        </form>
        <div id="login-error" style="color: red; margin-top: 15px; font-size: 13px; text-align: center;"></div>
      </div>
    </div>
  `;

  // 로그인 폼 제출 이벤트 바인딩
  const form = document.getElementById("login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");

    try {
      errorDiv.textContent = "";
      await loginUser(email, password);
    } catch (error) {
      errorDiv.textContent = "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
    }
  });
}

// 메인 대시보드 화면 렌더링 함수 (로그인 후)
function renderMainDashboard(container, user) {
  // 기존 프로젝트의 메인 UI 또는 탭 구조를 여기에 불러오거나 연결할 수 있습니다.
  container.innerHTML = `
    <div style="padding: 20px;">
      <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 20px;">
        <h2>PM/BM Management System</h2>
        <div>
          <span style="margin-right: 15px; font-weight: bold; color: #555;">${user.email} 님 환영합니다.</span>
          <button id="logout-btn" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">로그아웃</button>
        </div>
      </header>
      <main>
        <p>Firebase 인증 및 Firestore 데이터베이스 연동이 성공적으로 완료되었습니다!</p>
        <!-- 기존 프로젝트의 대시보드나 탭 컨텐츠가 들어갈 자리 -->
      </main>
    </div>
  `;

  // 로그아웃 버튼 이벤트 바인딩
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logoutUser();
  });
}
