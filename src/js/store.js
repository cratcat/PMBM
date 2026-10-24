// Firestore 데이터 입출력. 화면 코드(일반 스크립트)가 쓰는 전역 api 객체를 만듭니다.
import { db } from "./config.js";
import { S } from "./state.js";
import { logoutUser } from "./api.js";
import {
  collection, doc, getDocs, setDoc, deleteDoc, addDoc, query, orderBy, limit
} from "firebase/firestore";

const clean = (o) => JSON.parse(JSON.stringify(o)); // undefined 제거 (Firestore는 undefined 저장 불가)
const readAll = async (name) => (await getDocs(collection(db, name))).docs.map((d) => d.data());
const put = (name, o) => setDoc(doc(db, name, o.id), clean(o));

export const api = {
  async load() {
    const [tasks, eqs, part, logSnap] = await Promise.all([
      readAll("tasks"),
      readAll("equipment"),
      readAll("particles"),
      getDocs(query(collection(db, "logs"), orderBy("at", "desc"), limit(200)))
    ]);
    S.tasks = tasks;
    S.eqs = eqs.sort((a, b) => a.id.localeCompare(b.id));
    S.part = part;
    S.log = logSnap.docs.map((d) => d.data());
  },
  saveTask: (t) => put("tasks", t),
  delTask: (id) => deleteDoc(doc(db, "tasks", id)),
  saveEq: (e) => put("equipment", e),
  addLog: (l) => addDoc(collection(db, "logs"), clean(l)),
  savePart: (p) => put("particles", p),
  delPart: (id) => deleteDoc(doc(db, "particles", id)),
  // GPM TIP: GPM_URL을 채우면 직접 호출, 비어 있으면 빈 목록
  async loadTip(from, to) {
    if (!CONFIG.GPM_URL) return [];
    const r = await fetch(`${CONFIG.GPM_URL}?from=${from}&to=${to}`, { credentials: "include" });
    if (!r.ok) throw new Error("GPM " + r.status);
    return r.json();
  },
  logout: logoutUser
};

window.api = api;
