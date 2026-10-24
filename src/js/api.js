import { db } from "./config.js";
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. 사용자 정보 저장 (최초 로그인/가입 시)
export async function saveUserData(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: "user", // 기본 권한
      createdAt: serverTimestamp()
    });
  }
}

// 2. 사용자 활동 기록 함수 (activity_logs 컬렉션)
export async function logUserActivity(uid, actionType, targetData) {
  try {
    await addDoc(collection(db, "activity_logs"), {
      uid: uid,
      action: actionType,      // 예: "CREATE_PROJECT", "UPDATE_STATUS"
      target: targetData,      // 대상 데이터 정보
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("활동 기록 실패:", error);
  }
}
