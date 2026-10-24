// 탭: 월간 캘린더
registerTab({id:'cal',label:'캘린더',render(){
  const y=S.m.getFullYear(),m=S.m.getMonth(),f=new Date(y,m,1),st=addD(f,-f.getDay()),V=vis();
  let h=`<div class="bar"><button data-a="pm">‹</button><b>${y}년 ${m+1}월</b><button data-a="nm">›</button><button data-a="td">오늘</button>${filters()}</div>${tplBar()}<div class="cal">`+'일월화수목금토'.split('').map(d=>`<div class="dh">${d}</div>`).join('');
  for(let i=0;i<42;i++){const d=addD(st,i),k=fmt(d),ts=V.filter(t=>t.date===k);
    h+=`<div class="day ${d.getMonth()!==m?'out':''} ${k===TK?'today':''}" data-drop data-date="${k}" data-new="${k}"><span class="dn">${d.getDate()}</span>${ts.slice(0,3).map(t=>chip(t)).join('')}${ts.length>3?`<div class="note">+${ts.length-3}건 더 있음</div>`:''}</div>`}
  return h+`</div><p class="note">${can()?'일정을 다른 날짜로 끌어다 놓으면 변경되고, Alt를 누른 채 놓으면 복사됩니다. 빈 날짜를 더블클릭해도 새 작업을 등록할 수 있습니다.':'조회 권한입니다. 일정 변경은 엔지니어 이상만 가능합니다.'}</p>`}});
