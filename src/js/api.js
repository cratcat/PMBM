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
      role: "user",
      createdAt: serverTimestamp()
    });
  }
}

// 2. 사용자 활동 기록 함수 (activity_logs 컬렉션)
export async function logUserActivity(uid, actionType, targetData) {
  try {
    await addDoc(collection(db, "activity_logs"), {
      uid: uid,
      action: actionType,
      target: targetData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("활동 기록 실패:", error);
  }
}
