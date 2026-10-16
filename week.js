// 탭: 설비별 주간
registerTab({id:'wk',label:'설비별 주간',render(){
  const days=[...Array(7)].map((_,i)=>addD(S.w,i)),V=vis(),E=S.eqs.filter(e=>S.f.eq==='all'||e.id===S.f.eq);
  let h=`<div class="bar"><button data-a="pw">‹</button><b>${fmt(days[0]).slice(5)} ~ ${fmt(days[6]).slice(5)}</b><button data-a="nw">›</button><button data-a="tw">이번 주</button>${filters()}</div>${tplBar()}<div class="wk"><div class="h"></div>`+days.map(d=>`<div class="h ${fmt(d)===TK?'today':''}">${'일월화수목금토'[d.getDay()]} ${d.getDate()}</div>`).join('');
  E.forEach(e=>{h+=`<div class="eq">${esc(e.id)}<small>${esc(e.kind)} · ${esc(e.line)}</small></div>`+days.map(d=>{const k=fmt(d);return `<div data-drop data-date="${k}" data-eq="${esc(e.id)}" data-new="${k}" data-neweq="${esc(e.id)}" class="${k===TK?'today':''}">${V.filter(t=>t.eq===e.id&&t.date===k).map(t=>chip(t)).join('')}</div>`}).join('')});
  return h+`</div><p class="note">다른 설비 행으로 끌어다 놓으면 담당 설비도 함께 변경됩니다.</p>`}});
