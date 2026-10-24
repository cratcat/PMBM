// 탭: 파티클 Spec 현황표 (3개월 단위, 설비 × 일자)
// 초록 = Spec IN 측정일, 빨강 = Spec OUT 측정일, 노랑 = 미측정일, 'T' = TIP(Track In Prevent, GPM 서버 값)
let pgStart=new Date(today.getFullYear(),today.getMonth()-2,1);      // 기본: 이번 달 포함 최근 3개월
const pgTip={key:'',list:[],err:false,busy:false};

registerTab({id:'pgrid',label:'파티클 Spec 현황',render(){
  const end=new Date(pgStart.getFullYear(),pgStart.getMonth()+3,1),days=[];
  for(let d=new Date(pgStart);d<end;d=addD(d,1))days.push(d);
  const from=fmt(days[0]),to=fmt(days[days.length-1]),key=from+'|'+to;

  // GPM의 TIP 정보는 기간이 바뀔 때마다 한 번 불러오고, 끝나면 화면을 다시 그립니다. 실패해도 표는 그대로 보여줍니다.
  if(pgTip.key!==key){pgTip.key=key;pgTip.busy=true;pgTip.err=false;pgTip.list=[];
    api.loadTip(from,to).then(l=>{if(pgTip.key===key)pgTip.list=l}).catch(()=>{if(pgTip.key===key)pgTip.err=true})
      .finally(()=>{if(pgTip.key===key){pgTip.busy=false;if(S.tab==='pgrid'&&S.user)render()}})}

  const rows=S.eqs.map(e=>{
    const m={};S.part.filter(p=>p.eq===e.id&&p.date>=from&&p.date<=to).forEach(p=>{
      const x=m[p.date]=m[p.date]||{out:false,max:0};x.out=x.out||p.count>PARTICLE.limit;x.max=Math.max(x.max,p.count)});
    const tp=pgTip.list.filter(t=>t.eq===e.id),sum={in:0,out:0,none:0,tip:0};
    const cells=days.map(d=>{const k=fmt(d),x=m[k],fut=k>TK,tip=!fut&&tp.some(t=>t.start<=k&&(!t.end||k<=t.end));
      if(!fut){x?(x.out?sum.out++:sum.in++):sum.none++;if(tip)sum.tip++}
      const tt=e.id+' '+k+(x?`\n최대 ${x.max}${PARTICLE.unit} · Spec ${x.out?'OUT':'IN'}`:fut?'':'\n미측정')+(tip?'\nTIP 적용':'');
      return `<td class="pc ${fut?'f':x?(x.out?'r':'g'):'y'}" title="${esc(tt)}">${tip?'T':''}</td>`}).join('');
    return{e,cells,sum}});

  const mh=[];days.forEach(d=>{const l=d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0'),z=mh[mh.length-1];z&&z[0]===l?z[1]++:mh.push([l,1])});
  const note=pgTip.busy?'<span class="note">TIP 정보 불러오는 중…</span>':pgTip.err?'<span class="note" style="color:var(--bm)">GPM의 TIP 정보를 불러오지 못해 TIP 표시가 비어 있습니다.</span>':'';
  return `<div class="bar"><button data-pg="prev">‹ 이전 3개월</button><b style="min-width:160px">${from.slice(0,7)} ~ ${to.slice(0,7)}</b><button data-pg="next">다음 3개월 ›</button><button data-pg="today">최근 3개월</button><span class="sp"></span>
  <span><i class="lg g"></i>Spec IN<i class="lg r"></i>Spec OUT<i class="lg y"></i>미측정<i class="lg t">T</i>TIP</span></div>${note?`<p>${note}</p>`:''}
  <div class="panel" style="overflow-x:auto"><table class="pg"><tr><th class="eqh" rowspan="2">설비</th>${mh.map(([l,n])=>`<th colspan="${n}">${l}</th>`).join('')}</tr>
  <tr>${days.map(d=>`<th class="dd${d.getDay()%6===0?' we':''}${fmt(d)===TK?' today':''}">${d.getDate()}</th>`).join('')}</tr>
  ${rows.map(r=>`<tr><th class="eqh">${esc(r.e.id)}</th>${r.cells}</tr>`).join('')}</table></div>
  <div class="panel" style="margin-top:12px;overflow-x:auto"><h3>기간 요약 (오늘까지)</h3><table><tr><th>설비</th><th>Spec IN</th><th>Spec OUT</th><th>미측정</th><th>TIP 일수</th><th>IN 비율</th></tr>
  ${rows.map(({e,sum:s})=>`<tr><td>${esc(e.id)}</td><td>${s.in}일</td><td style="color:${s.out?'var(--bm)':'inherit'}">${s.out}일</td><td>${s.none}일</td><td>${s.tip}일</td><td>${s.in+s.out?Math.round(s.in/(s.in+s.out)*100):0}%</td></tr>`).join('')}</table>
  <p class="note">Spec OUT 기준: 파티클 수 ${PARTICLE.limit} ${PARTICLE.unit} 초과. 같은 날 여러 번 측정하면 하나라도 OUT이면 OUT입니다. 오늘 이후 날짜는 판정하지 않습니다.</p></div>`}});

document.addEventListener('click',e=>{const b=e.target.closest('[data-pg]');if(!b)return;const a=b.dataset.pg,y=pgStart.getFullYear(),m=pgStart.getMonth();
  pgStart=a==='prev'?new Date(y,m-3,1):a==='next'?new Date(y,m+3,1):new Date(today.getFullYear(),today.getMonth()-2,1);render()});
