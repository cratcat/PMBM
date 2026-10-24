import { auth } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { saveUserData } from "./api.js";

export const appState = {
  currentUser: null,
  userRole: "user"
};

// 로그인 상태 모니터링
export function initAuthListener(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      appState.currentUser = user;
      await saveUserData(user);
    } else {
      appState.currentUser = null;
    }
    if (callback) callback(user);
  });
}
