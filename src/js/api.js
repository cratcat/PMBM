import { db } from "./config.js";
import { auth } from "./config.js"; // auth 객체 가져오기
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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

// 3. 로그인 함수
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("로그인 오류:", error.message);
    throw error;
  }
}

// 4. 로그아웃 함수
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 오류:", error.message);
  }
}
