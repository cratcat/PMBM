// 탭: 대시보드
registerTab({id:'dash',label:'대시보드',render(){
  const mk=TK.slice(0,7),M=S.tasks.filter(t=>t.date.slice(0,7)===mk),pm=M.filter(t=>t.type==='PM'),pd=pm.filter(t=>t.status==='done').length,bm=M.filter(t=>t.type==='BM'),ov=S.tasks.filter(late),nx=S.tasks.filter(t=>t.status!=='done'&&t.date>=TK&&t.date<=fmt(addD(today,7))).sort((a,b)=>a.date.localeCompare(b.date));
  const bc=S.eqs.map(e=>[e.id,S.tasks.filter(t=>t.type==='BM'&&t.eq===e.id).length]).sort((a,b)=>b[1]-a[1]),mx=Math.max(1,bc[0]?.[1]||1);
  return `<div class="kpi"><div><b>${pm.length?Math.round(pd/pm.length*100):0}%</b><span>이번 달 PM 이행률 (${pd}/${pm.length})</span></div><div><b>${bm.length}</b><span>이번 달 BM 건수</span></div><div><b style="color:var(--bm)">${ov.length}</b><span>기한 초과 미완료</span></div><div><b>${nx.length}</b><span>7일 내 예정 작업</span></div></div>
  <div class="two"><div class="panel"><h3>설비별 BM 누적 건수</h3>${bc.map(([n,c])=>`<div class="br"><span>${esc(n)}</span><i style="width:${c/mx*100}%;min-width:${c?4:0}px"></i><b>${c}</b></div>`).join('')}</div>
  <div class="panel"><h3>7일 내 예정 / 기한 초과</h3><table>${[...ov,...nx].map(t=>`<tr data-edit="${t.id}" style="cursor:pointer"><td>${t.date.slice(5)}</td><td>${esc(t.eq)}</td><td>${esc(t.title)}</td><td style="color:var(--${t.type==='PM'?'pm':'bm'})">${t.type}</td></tr>`).join('')||'<tr><td class="note">해당 작업이 없습니다.</td></tr>'}</table></div></div>`}});
