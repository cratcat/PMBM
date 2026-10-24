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
