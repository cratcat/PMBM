import { initAuthListener } from "./state.js";
import { loginUser, logoutUser } from "./api.js";
import { render } from "./view.js"; // 원본 프로젝트의 렌더링 함수 임포트

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");

  // 1. 로그인 상태 감지 리스너 실행
  initAuthListener((user) => {
    if (user) {
      // [로그인 성공 상태] 상단 유저바 표시 + 원래 PM/BM 화면 렌더링
      console.log("로그인됨:", user.email);
      renderOriginalApp(appContainer, user);
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
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #1a1a1a; z-index: 9999;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); width: 350px;">
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

// 로그인 성공 시 상단 바를 띄우고, 원래 앱의 UI 컨텐츠 렌더링
function renderOriginalApp(container, user) {
  container.innerHTML = `
    <div id="auth-header" style="display: flex; justify-content: space-between; align-items: center; background: #222; color: white; padding: 10px 20px; font-size: 14px;">
      <span>PM/BM Management System</span>
      <div>
        <span style="margin-right: 15px; color: #ccc;">${user.email} 님 환영합니다.</span>
        <button id="logout-btn" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">로그아웃</button>
      </div>
    </div>
    <div id="original-app-content">
      <!-- 원래 프로젝트 UI 영역 -->
    </div>
  `;

  // 로그아웃 버튼 이벤트 바인딩
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logoutUser();
  });

  // 원래 프로젝트의 화면 렌더링 함수 실행
  try {
    if (typeof render === "function") {
      render();
    }
  } catch (error) {
    console.error("원본 화면 렌더링 중 오류:", error);
  }
}
