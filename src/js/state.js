import { auth, db } from "./config.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { saveUserData } from "./api.js";

// 전역 상태 객체 S (일반 스크립트와 탭 파일들이 window.S 로 함께 사용)
const t0 = new Date(); t0.setHours(0, 0, 0, 0);
const wk = new Date(t0); wk.setDate(wk.getDate() - wk.getDay());

export const S = {
  user: null,
  tab: "cal",
  tasks: [],
  eqs: [],
  log: [],
  part: [],
  f: { type: "all", eq: "all", owner: "all", sp: 3 },
  m: new Date(t0.getFullYear(), t0.getMonth(), 1),
  w: wk
};
window.S = S;
export const appState = S;

// Firestore users/{uid}.role 이 admin | engineer | viewer 중 하나면 그 권한, 아니면 조회자
async function buildUser(user) {
  let role = "viewer";
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    const r = snap.exists() ? snap.data().role : null;
    if (["admin", "engineer", "viewer"].includes(r)) role = r;
  } catch (e) { console.error("권한 조회 실패:", e); }
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName || (user.email || "").split("@")[0],
    role
  };
}

export function initAuthListener(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try { await saveUserData(user); } catch (e) { console.error(e); }
      S.user = await buildUser(user);
    } else {
      S.user = null;
      S.tasks = []; S.eqs = []; S.log = []; S.part = [];
    }
    if (callback) callback(S.user);
  });
}
