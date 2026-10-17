// 탭: 파티클 관리 (측정 입력, 기준 대비 상태, 추이 그래프, 측정 이력)
const PS={ok:['정상','var(--pm)'],warn:['경고','var(--ac)'],over:['한도 초과','var(--bm)']};
const partStat=v=>v>PARTICLE.limit?'over':v>PARTICLE.warn?'warn':'ok';
const partBadge=k=>`<b style="color:${PS[k][1]}">${PS[k][0]}</b>`;

// 설비별 추이 그래프 (외부 라이브러리 없이 SVG)
const partChart=P=>{
  if(!P.length)return '<p class="note">측정 데이터가 없습니다.</p>';
  const W=720,H=230,m={l:36,r:10,t:10,b:24},C=['#2456d6','#2a7a57','#b9770e','#8a4fd0','#0f8b9d','#c93c3c'];
  const T=p=>+new Date(p.date+'T00:00'),ts=P.map(T),t0=Math.min(...ts),t1=Math.max(...ts,t0+864e5);
  const ymax=Math.max(PARTICLE.limit*1.25,...P.map(p=>p.count));
  const X=p=>m.l+(T(p)-t0)/(t1-t0)*(W-m.l-m.r),Y=v=>H-m.b-v/ymax*(H-m.t-m.b);
  const ids=[...new Set(P.map(p=>p.eq))];
  const lines=ids.map((id,i)=>{const s=P.filter(p=>p.eq===id);
    return `<polyline fill="none" stroke="${C[i%6]}" stroke-width="2" points="${s.map(p=>X(p)+','+Y(p.count)).join(' ')}"/>`+
      s.map(p=>`<circle cx="${X(p)}" cy="${Y(p.count)}" r="3.5" style="fill:${p.count>PARTICLE.limit?'var(--bm)':C[i%6]}"><title>${esc(id)} ${p.date}: ${p.count}${PARTICLE.unit}</title></circle>`).join('')}).join('');
  const hl=(v,col,n)=>`<line x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke-dasharray="5 4" style="stroke:${col}"/><text x="${W-m.r}" y="${Y(v)-4}" text-anchor="end" font-size="11" style="fill:${col}">${n} ${v}</text>`;
  const tx=(x,y,t,a)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="11" style="fill:var(--mu)">${t}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="파티클 추이 그래프">
  <line x1="${m.l}" x2="${m.l}" y1="${m.t}" y2="${H-m.b}" style="stroke:var(--bd)"/><line x1="${m.l}" x2="${W-m.r}" y1="${H-m.b}" y2="${H-m.b}" style="stroke:var(--bd)"/>
  ${tx(m.l-4,Y(0)+4,0,'end')}${tx(m.l-4,Y(ymax)+10,Math.round(ymax),'end')}${tx(m.l,H-6,P.reduce((a,p)=>p.date<a?p.date:a,P[0].date).slice(5),'start')}${tx(W-m.r,H-6,P[P.length-1].date.slice(5),'end')}
  ${hl(PARTICLE.warn,'var(--ac)','경고')}${hl(PARTICLE.limit,'var(--bm)','한도')}${lines}</svg>
  <div class="bar" style="margin:6px 0 0">${ids.map((id,i)=>`<span class="note"><span style="color:${C[i%6]}">●</span> ${esc(id)}</span>`).join('')}</div>`};

registerTab({id:'part',label:'파티클',render(){
  const E=S.eqs.filter(e=>S.f.eq==='all'||e.id===S.f.eq),ids=new Set(E.map(e=>e.id));
  const P=S.part.filter(p=>ids.has(p.eq)).sort((a,b)=>a.date.localeCompare(b.date)),d30=fmt(addD(today,-30)),d14=fmt(addD(today,-14));
  const R=E.map(e=>{const s=P.filter(p=>p.eq===e.id),l=s[s.length-1],pv=s[s.length-2];
    return{e,l,pv,st:l&&partStat(l.count),rise:s.length>=3&&s[s.length-1].count>s[s.length-2].count&&s[s.length-2].count>s[s.length-3].count,
      wait:S.tasks.some(t=>t.eq===e.id&&t.type==='PM'&&t.status==='done'&&t.date>=d14&&!s.some(p=>p.date>=t.date))}});
  const rc=P.filter(p=>p.date>=d30),okn=rc.filter(p=>p.count<=PARTICLE.limit).length;
  const opt=a=>a.map(x=>`<option>${esc(x)}</option>`).join('');
  return `<div class="bar"><b style="text-align:left">파티클 관리</b><span class="note">${PARTICLE.size} · ${PARTICLE.unit} · 경고 ${PARTICLE.warn} / 한도 ${PARTICLE.limit}</span><span class="sp"></span>
  <select data-f="eq"><option value="all">전체 설비</option>${S.eqs.map(e=>`<option${S.f.eq===e.id?' selected':''}>${esc(e.id)}</option>`).join('')}</select></div>
  <div class="kpi"><div><b>${rc.length?Math.round(okn/rc.length*100):0}%</b><span>최근 30일 한도 이내 비율 (${okn}/${rc.length})</span></div>
  <div><b style="color:var(--bm)">${R.filter(r=>r.st==='over').length}</b><span>현재 한도 초과 설비</span></div>
  <div><b style="color:var(--ac)">${R.filter(r=>r.st==='warn'||(r.st==='ok'&&r.rise)).length}</b><span>경고·연속 상승 설비</span></div>
  <div><b>${R.filter(r=>r.wait).length}</b><span>PM 후 측정 대기 설비</span></div></div>
  <div class="two"><div class="panel"><h3>추이 (최근 측정 기준)</h3>${partChart(P.filter(p=>p.date>=fmt(addD(today,-90))))}</div>
  <div class="panel" style="overflow-x:auto"><h3>설비별 현재 상태</h3><table><tr><th>설비</th><th>최근값</th><th>상태</th><th>추세</th><th>측정일</th><th></th></tr>${R.map(r=>`<tr><td>${esc(r.e.id)}</td><td>${r.l?r.l.count:'-'}</td><td>${r.st?partBadge(r.st):'<span class="note">미측정</span>'}</td>
  <td>${r.l&&r.pv?(r.l.count>r.pv.count?'▲':r.l.count<r.pv.count?'▼':'–'):''}${r.rise?' 연속 상승':''}</td><td>${r.l?r.l.date.slice(5):'-'}</td>
  <td>${r.wait?'<span class="note">PM 후 측정 필요</span> ':''}${r.st==='over'&&can()?`<button data-pbm="${esc(r.e.id)}">BM 등록</button>`:''}</td></tr>`).join('')}</table></div></div>
  ${can()?`<div class="panel" style="margin-top:12px"><h3>측정값 입력</h3><div class="fg"><div><label class="note">설비</label><select id="pe">${S.eqs.map(e=>`<option${S.f.eq===e.id?' selected':''}>${esc(e.id)}</option>`).join('')}</select></div>
  <div><label class="note">측정일</label><input type="date" id="pd" value="${TK}"></div><div><label class="note">파티클 수 (${PARTICLE.unit})</label><input type="number" id="pc" min="0" step="any"></div>
  <div><label class="note">구분</label><select id="pk">${opt(PARTICLE.kinds)}</select></div><div><label class="note">비고</label><input id="pn"></div><button class="pri" data-padd>저장</button></div></div>`:''}
  <div class="panel" style="margin-top:12px;overflow-x:auto"><h3>측정 이력 (최근 15건)</h3><table><tr><th>측정일</th><th>설비</th><th>파티클 수</th><th>상태</th><th>구분</th><th>비고</th><th></th></tr>${P.slice(-15).reverse().map(p=>`<tr><td>${p.date}</td><td>${esc(p.eq)}</td><td>${p.count}</td><td>${partBadge(partStat(p.count))}</td><td>${esc(p.kind)}</td><td class="note">${esc(p.note)}</td>
  <td>${ROLES[S.user.role].manage?`<button data-pdel="${esc(p.id)}">삭제</button>`:''}</td></tr>`).join('')||'<tr><td class="note">측정 데이터가 없습니다.</td></tr>'}</table></div>`}});

// 이 탭 전용 클릭 처리: 입력 저장, 삭제, BM 등록
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-pbm],[data-padd],[data-pdel]');if(!b)return;
  if(b.dataset.pbm)return openTask(null,TK,b.dataset.pbm,{title:'파티클 한도 초과 조치',type:'BM'});
  if(b.dataset.pdel)return guard(async()=>{const i=S.part.findIndex(x=>x.id===b.dataset.pdel),p=S.part[i];S.part.splice(i,1);
    try{await api.delPart(p.id)}catch(err){S.part.splice(i,0,p);throw err}logIt('파티클 삭제',{id:p.id,eq:p.eq,title:'파티클 '+p.count},p.date);render()});
  const v=id=>$('#'+id).value,c=parseFloat(v('pc'));
  if(!(c>=0)||!v('pd'))return toast('측정일과 파티클 수(0 이상)를 입력하세요.');
  guard(async()=>{const p={id:'p'+Date.now(),eq:v('pe'),date:v('pd'),count:c,kind:v('pk'),note:v('pn')};S.part.push(p);
    try{await api.savePart(p)}catch(err){S.part.pop();throw err}
    const st=partStat(c);logIt('파티클 측정',{id:p.id,eq:p.eq,title:'파티클 '+c+PARTICLE.unit},p.kind+' · '+PS[st][0]);
    render();toast(st==='over'?'기준 한도를 초과했습니다. BM 등록을 검토하세요.':'측정값을 저장했습니다.')})});

