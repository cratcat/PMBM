import { auth } from "./config.js";
import { onAuthStateChanged } from "firebase/auth";
import { saveUserData } from "./api.js";

// 1. view.js 등에서 사용하는 전역 상태 객체 S 정의
export const S = {
  user: null,
  tab: "dashboard",
  tasks: [],
  eqs: [],
  log: []
};

// 호환성을 위한 appState 연결
export const appState = S;

// 2. 로그인 상태 모니터링
export function initAuthListener(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      S.user = user; // 로그인 시 S.user에 반영
      await saveUserData(user);
    } else {
      S.user = null; // 로그아웃 시 초기화
    }
    if (callback) callback(user);
  });
}
