// 공용 유틸: DOM 선택, 이스케이프, 날짜 계산
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const today=new Date();today.setHours(0,0,0,0);const TK=fmt(today);
