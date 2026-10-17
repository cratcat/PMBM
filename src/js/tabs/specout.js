// 탭: 파티클 Spec-out 주기 (설비 × N개월 단위 비교표)
const addM=(d,n)=>{const x=new Date(d);x.setMonth(x.getMonth()+n);return x};
registerTab({id:"spec",label:"Spec-out",render(){
  const U=+(S.f.sp||3),N=4,E=[...Array(N+1)].map((_,i)=>fmt(addM(today,-U*i))),spec=p=>p.count>PARTICLE.limit;
  const R=S.eqs.map(e=>{
    const s=S.part.filter(p=>p.eq===e.id&&p.date>E[N]).sort((a,b)=>a.date.localeCompare(b.date)),so=s.filter(spec),
      b=[...Array(N)].map((_,i)=>{const m=s.filter(p=>p.date>E[i+1]&&p.date<=E[i]);return{n:m.length,x:m.filter(spec).length}}),
      iv=so.slice(1).map((p,i)=>(new Date(p.date)-new Date(so[i].date))/864e5);
    return{e,b,last:so[so.length-1],tot:so.length,avg:iv.length?Math.round(iv.reduce((a,c)=>a+c,0)/iv.length):null}
  }).sort((a,b)=>b.b[0].x-a.b[0].x||b.tot-a.tot||a.e.id.localeCompare(b.e.id));
  const T=[...Array(N)].map((_,i)=>({n:R.reduce((a,r)=>a+r.b[i].n,0),x:R.reduce((a,r)=>a+r.b[i].x,0)}));
  const cell=c=>!c.n?`<td style="text-align:center;color:var(--mu)">–</td>`:`<td style="text-align:center;background:var(${c.x?(c.x>=3?"--bms":"--acs"):"--pms"})" title="측정 ${c.n}회 중 ${c.x}회 Spec-out"><b>${c.x}</b><span class="note"> / ${c.n}</span></td>`;
  const trend=r=>{const d=r.b[0].x-r.b[1].x;return d>0?`<b style="color:var(--bm)">▲ 증가</b>`:d<0?`<b style="color:var(--pm)">▼ 감소</b>`:"–"};
  return `<div class="bar"><b style="text-align:left">Spec-out 주기</b><span class="note">설비별 한도(${PARTICLE.limit}${PARTICLE.unit}) 초과 발생 현황</span><span class="sp"></span>
  <select data-f="sp">${[1,3,6].map(m=>`<option value="${m}"${m===U?" selected":""}>${m}개월 단위</option>`).join("")}</select></div>
  <div class="panel" style="overflow-x:auto"><table><tr><th>설비</th>${E.slice(0,N).map((_,i)=>`<th style="text-align:center">${i?`${U*i}~${U*(i+1)}개월 전`:`최근 ${U}개월`}<br><span class="note">${E[i+1].slice(2)} ~ ${E[i].slice(2)}</span></th>`).join("")}<th>추세</th><th>마지막 Spec-out</th><th>평균 주기</th></tr>
  ${R.map(r=>`<tr data-spec="${esc(r.e.id)}" style="cursor:pointer" title="누르면 이 설비의 파티클 추이로 이동합니다"><td><b>${esc(r.e.id)}</b></td>${r.b.map(cell).join("")}<td>${trend(r)}</td>
  <td>${r.last?`${r.last.date.slice(2)} (${Math.round((today-new Date(r.last.date+"T00:00"))/864e5)}일 전)`:`<span class="note">없음</span>`}</td><td>${r.avg!==null?r.avg+"일":`<span class="note">-</span>`}</td></tr>`).join("")||`<tr><td class="note">설비가 없습니다.</td></tr>`}
  <tr><td><b>전체</b></td>${T.map(cell).join("")}<td></td><td></td><td></td></tr></table></div>
  <p class="note">Spec-out은 파티클 수가 한도를 초과한 측정입니다. 칸의 숫자는 “Spec-out 건수 / 측정 횟수”이고, 0건은 초록, 1~2건은 주황, 3건 이상은 빨강입니다. 평균 주기는 Spec-out이 2건 이상일 때 건 사이의 평균 간격입니다.</p>`}});
document.addEventListener("click",e=>{const r=e.target.closest("[data-spec]");if(!r)return;S.f.eq=r.dataset.spec;S.tab="part";render()});
